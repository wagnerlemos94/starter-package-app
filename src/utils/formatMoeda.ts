// Transforma números/strings em moeda: "1250" -> "R$ 12,50"
export const formatToCurrency = (value: string | number) => {
  const digits = String(value).replace(/\D/g, "");
  const num = Number(digits) / 100;
  
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(num);
};

// Remove o "R$" e formatações para salvar o número limpo: "R$ 12,50" -> 12.50
export const parseCurrencyToNumber = (value: string) => {
  const num = value.replace(/\D/g, "");
  return Number(num);
};

