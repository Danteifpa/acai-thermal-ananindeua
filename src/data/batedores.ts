export interface Batedor {
  id: string;
  nome: string;
  localizacao: string;
  material_atual: 'Plástico' | 'Metal';
  volume_atual: number;
  metodo: 'Artesanal' | 'Semi-Industrial';
}

export const batedoresData: Batedor[] = [
  { id: '1', nome: 'Batedouro do Nonato', localizacao: 'Ananindeua - Centro', material_atual: 'Plástico', volume_atual: 15, metodo: 'Artesanal' },
  { id: '2', nome: 'Açaí da Maria', localizacao: 'Ananindeua - Cidade Nova', material_atual: 'Plástico', volume_atual: 20, metodo: 'Artesanal' },
  { id: '3', nome: 'Ponto do Açaí Real', localizacao: 'Ananindeua - Coqueiro', material_atual: 'Metal', volume_atual: 25, metodo: 'Semi-Industrial' },
  { id: '4', nome: 'Batedouro São Francisco', localizacao: 'Ananindeua - Guajará', material_atual: 'Plástico', volume_atual: 12, metodo: 'Artesanal' },
  { id: '5', nome: 'Açaí do Japiim', localizacao: 'Ananindeua - Jaderlândia', material_atual: 'Plástico', volume_atual: 18, metodo: 'Artesanal' },
];