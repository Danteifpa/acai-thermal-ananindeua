export interface Batedor {
  id: string;
  nome: string;
  bairro: string;
  material_padrao: string;
  volume_padrao: number;
}

export const batedoresPesquisa: Batedor[] = [
  { id: '1', nome: 'Açaí do Nonato', bairro: 'Centro', material_padrao: 'Plástico', volume_padrao: 6.0 },
  { id: '2', nome: 'Ponto do Açaí Real', bairro: 'Cidade Nova', material_padrao: 'Metal', volume_padrao: 15.0 },
  { id: '3', nome: 'Batedouro São Francisco', bairro: 'Coqueiro', material_padrao: 'Tambor', volume_padrao: 20.0 },
  { id: '4', nome: 'Açaí da Maria', bairro: 'Guajará', material_padrao: 'Plástico', volume_padrao: 8.0 },
  { id: '5', nome: 'Estação do Açaí', bairro: 'Jaderlândia', material_padrao: 'Metal', volume_padrao: 12.5 },
  { id: '6', nome: 'Açaí do Paizão', bairro: 'Curuçambá', material_padrao: 'Isopor', volume_padrao: 5.0 },
  { id: '7', nome: 'Batedouro Ananindeua', bairro: 'Águas Lindas', material_padrao: 'Metal', volume_padrao: 18.0 },
  { id: '8', nome: 'Puro Açaí', bairro: 'Maguari', material_padrao: 'Plástico', volume_padrao: 7.5 },
];