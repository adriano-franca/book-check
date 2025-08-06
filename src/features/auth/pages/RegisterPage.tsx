import React, { useState } from 'react';
import axios from 'axios';
import { useAuthStore } from '@/app/stores/authStore';
import { useNavigate } from 'react-router-dom';

export const RegisterPage: React.FC = () => {
  const { login } = useAuthStore();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    tipoUsuario: 'leitor' as 'leitor' | 'sebo',
    nome: '',
    email: '',
    senha: '',
    confirmarSenha: '',
    cpf: '',
    cnpj: '',
    tipoLogradouro: '',
    logradouro: '',
    numero: '',
    bairro: '',
    cidade: '',
    uf: '',
    cep: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.senha !== formData.confirmarSenha) {
      setError('As senhas não coincidem');
      return;
    }
    setLoading(true);
    try {
      const endpoint = formData.tipoUsuario === 'leitor' ? '/usuario/leitor' : '/usuario/sebo';
      const payload = {
        nome: formData.nome,
        email: formData.email,
        senha: formData.senha,
        [formData.tipoUsuario === 'leitor' ? 'cpf' : 'cnpj']: formData.tipoUsuario === 'leitor' ? formData.cpf : formData.cnpj,
        endereco: {
          tipoLogradouro: formData.tipoLogradouro,
          logradouro: formData.logradouro,
          numero: formData.numero,
          bairro: formData.bairro,
          cidade: formData.cidade,
          uf: formData.uf,
          cep: formData.cep,
        },
      };
      await axios.post(`http://localhost:8080/api${endpoint}`, payload);
      await login(formData.email, formData.senha, formData.tipoUsuario);
      navigate('/home');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao cadastrar');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">Registrar no BookCheck</h1>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        {loading && <p className="text-blue-500 text-center mb-4">Carregando...</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="tipoUsuario" className="block text-sm font-medium text-gray-700">
              Tipo de Usuário
            </label>
            <select
              id="tipoUsuario"
              name="tipoUsuario"
              value={formData.tipoUsuario}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="leitor">Leitor</option>
              <option value="sebo">Sebo</option>
            </select>
          </div>
          <div>
            <label htmlFor="nome" className="block text-sm font-medium text-gray-700">
              Nome
            </label>
            <input
              id="nome"
              type="text"
              name="nome"
              placeholder="Nome completo"
              value={formData.nome}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              id="email"
              type="email"
              name="email"
              placeholder="seu@email.com"
              value={formData.email}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <div>
            <label htmlFor="senha" className="block text-sm font-medium text-gray-700">
              Senha
            </label>
            <input
              id="senha"
              type="password"
              name="senha"
              placeholder="Senha"
              value={formData.senha}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <div>
            <label htmlFor="confirmarSenha" className="block text-sm font-medium text-gray-700">
              Confirmar Senha
            </label>
            <input
              id="confirmarSenha"
              type="password"
              name="confirmarSenha"
              placeholder="Confirmar senha"
              value={formData.confirmarSenha}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          {formData.tipoUsuario === 'leitor' ? (
            <div>
              <label htmlFor="cpf" className="block text-sm font-medium text-gray-700">
                CPF
              </label>
              <input
                id="cpf"
                type="text"
                name="cpf"
                placeholder="123.456.789-00"
                value={formData.cpf}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
          ) : (
            <div>
              <label htmlFor="cnpj" className="block text-sm font-medium text-gray-700">
                CNPJ
              </label>
              <input
                id="cnpj"
                type="text"
                name="cnpj"
                placeholder="12.345.678/0001-99"
                value={formData.cnpj}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
          )}
          <div>
            <label htmlFor="tipoLogradouro" className="block text-sm font-medium text-gray-700">
              Tipo de Logradouro
            </label>
            <input
              id="tipoLogradouro"
              type="text"
              name="tipoLogradouro"
              placeholder="Rua, Avenida, etc."
              value={formData.tipoLogradouro}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <div>
            <label htmlFor="logradouro" className="block text-sm font-medium text-gray-700">
              Logradouro
            </label>
            <input
              id="logradouro"
              type="text"
              name="logradouro"
              placeholder="Nome da rua"
              value={formData.logradouro}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <div>
            <label htmlFor="numero" className="block text-sm font-medium text-gray-700">
              Número
            </label>
            <input
              id="numero"
              type="text"
              name="numero"
              placeholder="Número"
              value={formData.numero}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <div>
            <label htmlFor="bairro" className="block text-sm font-medium text-gray-700">
              Bairro
            </label>
            <input
              id="bairro"
              type="text"
              name="bairro"
              placeholder="Bairro"
              value={formData.bairro}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <div>
            <label htmlFor="cidade" className="block text-sm font-medium text-gray-700">
              Cidade
            </label>
            <input
              id="cidade"
              type="text"
              name="cidade"
              placeholder="Cidade"
              value={formData.cidade}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <div>
            <label htmlFor="uf" className="block text-sm font-medium text-gray-700">
              UF
            </label>
            <input
              id="uf"
              type="text"
              name="uf"
              placeholder="UF"
              value={formData.uf}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <div>
            <label htmlFor="cep" className="block text-sm font-medium text-gray-700">
              CEP
            </label>
            <input
              id="cep"
              type="text"
              name="cep"
              placeholder="12345-678"
              value={formData.cep}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-blue-300"
          >
            Registrar
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-600">
          Já tem uma conta?{' '}
          <a href="/login" className="text-blue-600 hover:underline">
            Faça login
          </a>
        </p>
      </div>
    </div>
  );
};