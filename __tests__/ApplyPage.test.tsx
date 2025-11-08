/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable no-undef */

// 1. Imports necessários
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom'; // Para ter os matchers como .toBeInTheDocument()

// O componente que vamos testar
import ApplyPage from '@/app/apply/page';
// 2. Mock Global do 'fetch'
// Precisamos "imitar" a API fetch para que o teste não tente fazer uma chamada de rede real.
global.fetch = jest.fn();

// Limpa os mocks antes de cada teste
beforeEach(() => {
  (global.fetch as jest.Mock).mockClear();
});

// 4. Início dos testes
describe('ApplyPage (Formulário de Solicitação)', () => {

  // Teste 1: Verifica se todos os campos e o botão renderizam corretamente
  it('deve renderizar o formulário com todos os campos obrigatórios', () => {
    render(<ApplyPage />);

    // Verifica o título
    expect(screen.getByRole('heading', { name: /Solicitar Acesso à Plataforma/i })).toBeInTheDocument();

    // Verifica os campos (usando 'getByLabelText' por causa da acessibilidade)
    expect(screen.getByLabelText(/Nome/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/E-mail/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Empresa/i)).toBeInTheDocument();
    // Requisito do PDF: Por que você quer participar? [cite: 49]
    expect(screen.getByLabelText(/Por que você quer participar?/i)).toBeInTheDocument();

    // Verifica o botão
    expect(screen.getByRole('button', { name: /Enviar Solicitação/i })).toBeInTheDocument();
  });

  // Teste 2: O "Caminho Feliz" (Happy Path) - Envio com sucesso
  it('deve submeter o formulário com sucesso e limpar os campos', async () => {
    // Configura o mock do fetch para retornar um SUCESSO (201)
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ id: '123', status: 'PENDING' }),
    });

    render(<ApplyPage />);

    // Preenche os campos obrigatórios
    fireEvent.change(screen.getByLabelText(/Nome/i), { target: { value: 'Usuário Teste' } });
    fireEvent.change(screen.getByLabelText(/E-mail/i), { target: { value: 'teste@exemplo.com' } });
    fireEvent.change(screen.getByLabelText(/Por que você quer participar?/i), { target: { value: 'Motivo do teste' } });

    // Clica no botão de enviar
    fireEvent.click(screen.getByRole('button', { name: /Enviar Solicitação/i }));

    // Verifica se o botão mudou para "Enviando..." e está desabilitado
    expect(screen.getByRole('button', { name: /Enviando.../i })).toBeDisabled();

    // Espera (assincronamente) a mensagem de sucesso aparecer
    await waitFor(() => {
      expect(screen.getByText(/Solicitação enviada com sucesso!/i)).toBeInTheDocument();
    });

    // Verifica se o 'fetch' foi chamado com os dados corretos
    expect(global.fetch).toHaveBeenCalledWith('/api/applications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Usuário Teste',
        email: 'teste@exemplo.com',
        company: '',
        reason: 'Motivo do teste',
      }),
    });

    // Verifica se os campos foram limpos após o sucesso
    expect(screen.getByLabelText(/Nome/i)).toHaveValue('');
    expect(screen.getByLabelText(/E-mail/i)).toHaveValue('');
    expect(screen.getByLabelText(/Por que você quer participar?/i)).toHaveValue('');
  });

  // Teste 3: O "Caminho Triste" (Sad Path) - Erro da API
  it('deve exibir uma mensagem de erro se a API falhar', async () => {
    // Configura o mock do fetch para retornar um ERRO (ex: e-mail duplicado)
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      status: 409,
      json: () => Promise.resolve({ error: 'E-mail já cadastrado.' }),
    });

    render(<ApplyPage />);

    // Preenche os campos
    fireEvent.change(screen.getByLabelText(/Nome/i), { target: { value: 'Usuário Teste' } });
    fireEvent.change(screen.getByLabelText(/E-mail/i), { target: { value: 'existente@exemplo.com' } });
    fireEvent.change(screen.getByLabelText(/Por que você quer participar?/i), { target: { value: 'Motivo' } });

    // Clica no botão de enviar
    fireEvent.click(screen.getByRole('button', { name: /Enviar Solicitação/i }));

    // Espera (assincronamente) a mensagem de ERRO vinda da API aparecer
    await waitFor(() => {
      expect(screen.getByText(/E-mail já cadastrado./i)).toBeInTheDocument();
    });

    // Verifica se o botão voltou ao normal (não está mais "Enviando...")
    expect(screen.getByRole('button', { name: /Enviar Solicitação/i })).toBeEnabled();

    // Verifica se os campos NÃO foram limpos
    expect(screen.getByLabelText(/Nome/i)).toHaveValue('Usuário Teste');
  });
});