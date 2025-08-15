import { useState, useEffect } from 'react';

/**
 * Hook customizado para "atrasar" a atualização de um valor.
 * Isso é útil para evitar chamadas de API a cada tecla digitada em um campo de busca.
 * @param value O valor a ser "atrasado".
 * @param delay O tempo de atraso em milissegundos.
 * @returns O valor "atrasado".
 */
export function useDebounce<T>(value: T, delay: number): T {
  // Estado para armazenar o valor com atraso
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Configura um temporizador para atualizar o valor com atraso
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Limpa o temporizador se o valor mudar antes do atraso terminar
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]); // Re-executa o efeito se o valor ou o atraso mudarem

  return debouncedValue;
}
