// app/admin/coupons/CouponForm.tsx
'use client';
import React, { useEffect, useState } from 'react';
import {
    CouponType,
    CouponConditionType,
    FireBaseDocument,
    UserType,
    ProductBundleType,
    SectionType,
} from '@/app/utils/types';
import { Timestamp } from 'firebase/firestore';
import CategorySelectorModal from './CategorySelectorModal';
import UserSelectorModal from './UserSelectorModal';
import ProductSelectorModal from './ProductSelectorModal';
import { useCollection } from '@/app/hooks/useCollection';

interface CouponFormProps {
  initialData?: (CouponType & { exist: boolean }) | null;
  onSubmit: (data: CouponType) => void;
  onCancel: () => void;
}

// Função para sanitizar o código: remove acentos, espaços e caracteres especiais.
const sanitizeCodigo = (value: string) => {
    return value
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-zA-Z0-9]/g, '');
};

const CouponForm: React.FC<CouponFormProps> = ({ initialData, onSubmit, onCancel }) => {
    // ===== ESTADOS DOS CAMPOS PRINCIPAIS =====
    const [codigo, setCodigo] = useState(initialData?.codigo || '');
    const [descricao, setDescricao] = useState(initialData?.descricao || '');
    const [tipo, setTipo] = useState<CouponType['tipo']>(initialData?.tipo || 'percentual');
    const [valor, setValor] = useState(initialData?.valor || 0);
    const [dataInicio, setDataInicio] = useState(
        initialData ? new Date(initialData.dataInicio.seconds * 1000).toISOString().substring(0, 10) : '',
    );
    const [dataExpiracao, setDataExpiracao] = useState(
        initialData ? new Date(initialData.dataExpiracao.seconds * 1000).toISOString().substring(0, 10) : '',
    );
    const [limiteUsoGlobal, setLimiteUsoGlobal] = useState(initialData?.limiteUsoGlobal?.toString() || '');
    const [limiteUsoPorUsuario, setLimiteUsoPorUsuario] = useState(initialData?.limiteUsoPorUsuario?.toString() || '');

    // ===== ESTADOS DAS CONDIÇÕES DO CUPOM =====
    const [valorMinimoCompra, setValorMinimoCompra] = useState(initialData?.condicoes?.valorMinimoCompra?.toString() || '');
    const [textoExplicativo, setTextoExplicativo] = useState(initialData?.condicoes?.textoExplicativo || '');
    const [primeiraCompraApenas, setPrimeiraCompraApenas] = useState(initialData?.condicoes?.primeiraCompraApenas || false);
    const [cumulativo, setCumulativo] = useState(initialData?.cumulativo || false);
    const [status, setStatus] = useState<CouponType['status']>(initialData?.status || 'ativo');

    // ===== ESTADOS PARA USUÁRIOS (SEM CONFLITO COM A LIMITAÇÃO) =====
    const [selectedUsers, setSelectedUsers] = useState<(UserType & FireBaseDocument)[]>([]);
    const [showUserModal, setShowUserModal] = useState(false);

  // ===== ESTADOS PARA A LIMITAÇÃO: categorias x produtos =====
  type LimitationType = 'none' | 'categorias' | 'produtos';
  const itHasCategoriesLimitation = initialData?.condicoes?.categoriasPermitidas && initialData?.condicoes?.categoriasPermitidas.length > 0;
  const itHasProductsLimitation = initialData?.condicoes?.produtosEspecificos && initialData?.condicoes?.produtosEspecificos.length > 0;
  const [limitationType, setLimitationType] = useState<LimitationType>(itHasCategoriesLimitation ? 'categorias' : (itHasProductsLimitation ? 'produtos' : 'none'));

  const initialSelectedCategories = initialData?.condicoes?.categoriasPermitidas && initialData?.condicoes?.categoriasPermitidas.length > 0 && initialData.condicoes.categoriasPermitidas;

  const initialSelectedProducts = initialData?.condicoes?.produtosEspecificos && initialData?.condicoes?.produtosEspecificos.length > 0 && initialData.condicoes.produtosEspecificos;

  const [selectedCategories, setSelectedCategories] = useState<(SectionType & FireBaseDocument)[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<(ProductBundleType & FireBaseDocument)[]>([]);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showProductModal, setShowProductModal] = useState(false);

  // ===== ESTADOS PARA O ACCORDION (COLAPSÁVEL) =====
  const [openDados, setOpenDados] = useState(true);
  const [openCondicoes, setOpenCondicoes] = useState(true);

  const { getAllDocuments: getAllSectionsDocs } = useCollection<SectionType>('siteSections');
  const { getDocumentById: getProductDocById } = useCollection<ProductBundleType>('products');


  useEffect(() => {
      console.log('AAAAAAAAAAAAaa');
      console.log('initialSelectedCategories', initialSelectedCategories);

      async function getAllProductsDocsListAndUpdateSelectedProducts(initialSelectedProducts: string[]) {
          if (initialSelectedProducts) {
              for (const product of initialSelectedProducts) {
                  const doc = await getProductDocById(product);
                  if (doc) {
                      setSelectedProducts((prev) => [...prev, doc]);
                  }
              }
          }
      }

      async function getAllSectionsDocsListAndUpdateSelectedCategories(initialSelectedCategories: string[]) {
          if (initialSelectedCategories) {
              for (const category of initialSelectedCategories) {
                  const docs = await getAllSectionsDocs([{ field: 'sectionName', operator: '==', value: category }]);
                  if (docs && docs.length > 0) {
                      setSelectedCategories((prev) => [...prev, docs[0]]);
                  }
              }
          }
      }

      if (initialSelectedCategories) {
          getAllSectionsDocsListAndUpdateSelectedCategories(initialSelectedCategories);
      }

      if(initialSelectedProducts) {
          getAllProductsDocsListAndUpdateSelectedProducts(initialSelectedProducts);
      }
  }, []);

  // ===== ESTADOS PARA O TIPO DE LIMITAÇÃO =====
  // --- Quando o usuário escolhe uma limitação, limpa o outro grupo automaticamente ---
  const handleLimitationChange = (value: LimitationType) => {
      setLimitationType(value);
      if (value === 'categorias') {
          setSelectedProducts([]); // limpa produtos
      } else if (value === 'produtos') {
          setSelectedCategories([]); // limpa categorias
      }
  };

  // ===== FUNÇÃO DE PREVIEW (MOSTRAR FORM) =====
  const handleShowFormPreview = () => {
      // Monta o objeto de condições somente com os campos definidos
      const condicoes: Partial<CouponConditionType> = { textoExplicativo };
      if (valorMinimoCompra.trim() !== '') {
          condicoes.valorMinimoCompra = Number(valorMinimoCompra);
      }
      if (primeiraCompraApenas) {
          condicoes.primeiraCompraApenas = true;
      }
      if (selectedUsers.length > 0) {
          condicoes.somenteUsuarios = selectedUsers.map((user) => user.userId);
      }
      if (limitationType === 'categorias' && selectedCategories.length > 0) {
          condicoes.categoriasPermitidas = selectedCategories.map((cat) => cat.sectionName);
      } else if (limitationType === 'produtos' && selectedProducts.length > 0) {
          condicoes.produtosEspecificos = selectedProducts.map((prod) => prod.id);
      }
      // O objeto final do cupom utiliza o código sanitizado como ID
      const couponPreview: CouponType = {
          id: codigo,
          codigo,
          descricao,
          tipo,
          valor: tipo === 'freteGratis' ? 0 : Number(valor),
          dataInicio: Timestamp.fromDate(new Date(dataInicio)),
          dataExpiracao: Timestamp.fromDate(new Date(dataExpiracao)),
          limiteUsoGlobal: limiteUsoGlobal !== '' ? Number(limiteUsoGlobal) : null,
          limiteUsoPorUsuario: limiteUsoPorUsuario !== '' ? Number(limiteUsoPorUsuario) : null,
          condicoes: condicoes as CouponConditionType,
          cumulativo,
          status,
          criadoEm: initialData?.criadoEm || Timestamp.now(),
          atualizadoEm: Timestamp.now(),
      };
      console.log('Form Preview:', couponPreview);
  };

  // ===== FUNÇÃO DE VALIDAÇÃO E SUBMISSÃO =====
  const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();

      // Lista de erros para campos obrigatórios
      const missingFields: string[] = [];
      if (!codigo.trim()) missingFields.push('Código');
      if (!descricao.trim()) missingFields.push('Descrição');
      if (!tipo) missingFields.push('Tipo');
      if (tipo !== 'freteGratis' && (!valor || valor <= 0)) missingFields.push('Valor');
      if (!dataInicio) missingFields.push('Data Início');
      if (!dataExpiracao) missingFields.push('Data Expiração');
      if (!textoExplicativo.trim()) missingFields.push('Texto Explicativo');

      // Se o usuário escolheu limitar, exige que haja pelo menos um item selecionado
      if (limitationType === 'categorias' && selectedCategories.length === 0) {
          missingFields.push('Pelo menos uma Categoria');
      }
      if (limitationType === 'produtos' && selectedProducts.length === 0) {
          missingFields.push('Pelo menos um Produto');
      }

      if (missingFields.length > 0) {
          alert(`Por favor, preencha os seguintes campos obrigatórios:\n\n${missingFields.join(', \n\n')}`);
          return;
      }

      // Monta o objeto de condições somente com os campos definidos
      const condicoes: Partial<CouponConditionType> = { textoExplicativo };
      if (valorMinimoCompra.trim() !== '') {
          condicoes.valorMinimoCompra = Number(valorMinimoCompra);
      }
      if (primeiraCompraApenas) {
          condicoes.primeiraCompraApenas = true;
      }
      if (selectedUsers.length > 0) {
          condicoes.somenteUsuarios = selectedUsers.map((user) => user.userId);
      }
      if (limitationType === 'categorias' && selectedCategories.length > 0) {
          condicoes.categoriasPermitidas = selectedCategories.map((cat) => cat.id);
      } else if (limitationType === 'produtos' && selectedProducts.length > 0) {
          condicoes.produtosEspecificos = selectedProducts.map((prod) => prod.id);
      }
      // Se a limitação for "none", não inclui nenhum dos dois campos

      const coupon: CouponType = {
          id: codigo,
          codigo,
          descricao,
          tipo,
          valor: tipo === 'freteGratis' ? 0 : Number(valor),
          dataInicio: Timestamp.fromDate(new Date(dataInicio)),
          dataExpiracao: Timestamp.fromDate(new Date(dataExpiracao)),
          limiteUsoGlobal: limiteUsoGlobal !== '' ? Number(limiteUsoGlobal) : null,
          limiteUsoPorUsuario: limiteUsoPorUsuario !== '' ? Number(limiteUsoPorUsuario) : null,
          condicoes: condicoes as CouponConditionType,
          cumulativo,
          status,
          criadoEm: initialData?.criadoEm || Timestamp.now(),
          atualizadoEm: Timestamp.now(),
      };

      onSubmit(coupon);
  };

  return (
      <div className="max-h-[calc(100vh-2rem)] overflow-y-auto p-4">
          { /* Accordion – Seção 1: Dados do Cupom */ }
          <div className="mb-4 border rounded shadow">
              <button
                  type="button"
                  onClick={ () => setOpenDados(!openDados) }
                  className="w-full text-left bg-gray-200 p-3 font-bold text-lg"
              >
          Dados do Cupom { openDados ? '▲' : '▼' }
              </button>
              { openDados && (
                  <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                          <label className="block font-semibold mb-1">Código</label>
                          <input
                              type="text"
                              value={ codigo }
                              onChange={ (e) => setCodigo(sanitizeCodigo(e.target.value)) }
                              className="w-full border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                              required
                          />
                          <small className="text-gray-500">Apenas letras e números (sem espaços ou caracteres especiais).</small>
                      </div>
                      <div>
                          <label className="block font-semibold mb-1">Descrição</label>
                          <input
                              type="text"
                              value={ descricao }
                              onChange={ (e) => setDescricao(e.target.value) }
                              className="w-full border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                              required
                          />
                      </div>
                      <div>
                          <label className="block font-semibold mb-1">Tipo</label>
                          <select
                              value={ tipo }
                              onChange={ (e) => setTipo(e.target.value as CouponType['tipo']) }
                              className="w-full border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                              <option value="percentual">Percentual</option>
                              <option value="fixo">Valor Fixo</option>
                              <option value="freteGratis">Frete Grátis</option>
                          </select>
                      </div>
                      <div>
                          <label className="block font-semibold mb-1">Valor</label>
                          { tipo === 'freteGratis' ? (
                              <input
                                  type="text"
                                  value="frete grátis"
                                  disabled
                                  className="w-full border rounded p-2 bg-gray-100 text-gray-600"
                              />
                          ) : (
                              <input
                                  type="number"
                                  value={ valor }
                                  onChange={ (e) => setValor(Number(e.target.value)) }
                                  className="w-full border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  required
                              />
                          ) }
                      </div>
                      <div>
                          <label className="block font-semibold mb-1">Data Início</label>
                          <input
                              type="date"
                              value={ dataInicio }
                              onChange={ (e) => setDataInicio(e.target.value) }
                              className="w-full border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                              required
                          />
                      </div>
                      <div>
                          <label className="block font-semibold mb-1">Data Expiração</label>
                          <input
                              type="date"
                              value={ dataExpiracao }
                              onChange={ (e) => setDataExpiracao(e.target.value) }
                              className="w-full border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                              required
                          />
                      </div>
                      <div>
                          <label className="block font-semibold mb-1">Quantidade</label>
                          <input
                              type="number"
                              value={ limiteUsoGlobal }
                              onChange={ (e) => setLimiteUsoGlobal(e.target.value) }
                              className="w-full border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="Ilimitado se em branco"
                          />
                      </div>
                      <div>
                          <label className="block font-semibold mb-1">Limite por Usuário</label>
                          <input
                              type="number"
                              value={ limiteUsoPorUsuario }
                              onChange={ (e) => setLimiteUsoPorUsuario(e.target.value) }
                              className="w-full border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="Ilimitado se em branco"
                          />
                      </div>
                  </div>
              ) }
          </div>

          { /* Accordion – Seção 2: Condições e Limitações */ }
          <div className="mb-4 border rounded shadow">
              <button
                  type="button"
                  onClick={ () => setOpenCondicoes(!openCondicoes) }
                  className="w-full text-left bg-gray-200 p-3 font-bold text-lg"
              >
          Condições e Limitações { openCondicoes ? '▲' : '▼' }
              </button>
              { openCondicoes && (
                  <div className="p-4 grid grid-cols-1 gap-4">
                      { /* Linha de Condições Básicas */ }
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                              <label className="block font-semibold mb-1">Valor Mínimo da Compra</label>
                              <input
                                  type="number"
                                  value={ valorMinimoCompra }
                                  onChange={ (e) => setValorMinimoCompra(e.target.value) }
                                  className="w-full border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  placeholder="Opcional"
                              />
                          </div>
                          <div>
                              <label className="block font-semibold mb-1">
                  Texto Explicativo <span className="text-red-500">*</span>
                              </label>
                              <textarea
                                  value={ textoExplicativo }
                                  onChange={ (e) => setTextoExplicativo(e.target.value) }
                                  className="w-full border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  required
                              ></textarea>
                          </div>
                      </div>
                      <div className="flex flex-col items-start md:flex-row md:items-center gap-10">
                          <label className="flex items-center">
                              <input
                                  type="checkbox"
                                  checked={ primeiraCompraApenas }
                                  onChange={ (e) => setPrimeiraCompraApenas(e.target.checked) }
                                  className="w-4 h-4 mr-2"
                              />
                              <span className="font-semibold">Primeira Compra Apenas</span>
                          </label>
                          <label className="flex items-center">
                              <input
                                  type="checkbox"
                                  checked={ cumulativo }
                                  onChange={ (e) => setCumulativo(e.target.checked) }
                                  className="w-4 h-4 mr-2"
                              />
                              <span className="font-semibold">Cupom Cumulativo?</span>
                          </label>
                          <div>
                              <label className="block font-semibold mb-1">Status</label>
                              <select
                                  value={ status }
                                  onChange={ (e) => setStatus(e.target.value as CouponType['status']) }
                                  className="w-full border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                              >
                                  <option value="ativo">Ativo</option>
                                  <option value="desativado">Desativado</option>
                              </select>
                          </div>
                      </div>
                      { /* Seção de Usuários Permitidos */ }
                      <div className="border p-4 rounded">
                          <h3 className="font-bold mb-2">Usuários Permitidos</h3>
                          <button
                              type="button"
                              onClick={ () => setShowUserModal(true) }
                              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                          >
                Selecionar Usuários
                          </button>
                          { selectedUsers.length > 0 && (
                              <ul className="mt-2 space-y-1">
                                  { selectedUsers.map((user) => (
                                      <li key={ user.id } className="flex items-center justify-between bg-gray-100 p-2 rounded">
                                          <span>
                                              { user.nome } ({ user.email })
                                          </span>
                                          <button
                                              type="button"
                                              onClick={ () =>
                                                  setSelectedUsers(selectedUsers.filter((u) => u.id !== user.id))
                                              }
                                              className="text-red-500"
                                          >
                        Remover
                                          </button>
                                      </li>
                                  )) }
                              </ul>
                          ) }
                      </div>
                      { /* Seção de Limitação: escolha entre categorias ou produtos */ }
                      <div className="border p-4 rounded">
                          <h3 className="font-bold mb-8">Limitação do Cupom</h3>
                          <div className="flex flex-col items-start md:flex-row md:items-center gap-8 mb-4">
                              <label className="flex items-center">
                                  <input
                                      type="radio"
                                      name="limitationType"
                                      value="none"
                                      checked={ limitationType === 'none' }
                                      onChange={ () => handleLimitationChange('none') }
                                      className="mr-1"
                                  />
                                  <span>Nenhuma</span>
                              </label>
                              <label className="flex items-center">
                                  <input
                                      type="radio"
                                      name="limitationType"
                                      value="categorias"
                                      checked={ limitationType === 'categorias' }
                                      onChange={ () => handleLimitationChange('categorias') }
                                      className="mr-1"
                                  />
                                  <span>Por Categorias</span>
                              </label>
                              <label className="flex items-center">
                                  <input
                                      type="radio"
                                      name="limitationType"
                                      value="produtos"
                                      checked={ limitationType === 'produtos' }
                                      onChange={ () => handleLimitationChange('produtos') }
                                      className="mr-1"
                                  />
                                  <span>Por Produtos</span>
                              </label>
                          </div>
                          { limitationType === 'categorias' && (
                              <div>
                                  <button
                                      type="button"
                                      onClick={ () => setShowCategoryModal(true) }
                                      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                                  >
                    Selecionar Categorias
                                  </button>
                                  { selectedCategories.length > 0 && (
                                      <ul className="mt-2 space-y-1">
                                          { selectedCategories.map((cat) => (
                                              <li key={ cat.id } className="flex items-center justify-between bg-gray-100 p-2 rounded">
                                                  <span>{ cat.sectionName }</span>
                                                  <button
                                                      type="button"
                                                      onClick={ () =>
                                                          setSelectedCategories(selectedCategories.filter((c) => c.id !== cat.id))
                                                      }
                                                      className="text-red-500"
                                                  >
                            Remover
                                                  </button>
                                              </li>
                                          )) }
                                      </ul>
                                  ) }
                              </div>
                          ) }
                          { limitationType === 'produtos' && (
                              <div>
                                  <button
                                      type="button"
                                      onClick={ () => setShowProductModal(true) }
                                      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                                  >
                    Selecionar Produtos
                                  </button>
                                  { selectedProducts.length > 0 && (
                                      <ul className="mt-2 space-y-1">
                                          { selectedProducts.map((prod) => (
                                              <li key={ prod.id } className="flex items-center justify-between bg-gray-100 p-2 rounded">
                                                  <div className="flex items-center gap-2">
                                                      <img
                                                          src={ prod.images?.[0]?.localUrl || '/placeholder.png' }
                                                          alt={ prod.name }
                                                          className="w-10 h-10 object-cover rounded"
                                                      />
                                                      <span>{ prod.name }</span>
                                                  </div>
                                                  <button
                                                      type="button"
                                                      onClick={ () =>
                                                          setSelectedProducts(selectedProducts.filter((p) => p.id !== prod.id))
                                                      }
                                                      className="text-red-500"
                                                  >
                            Remover
                                                  </button>
                                              </li>
                                          )) }
                                      </ul>
                                  ) }
                              </div>
                          ) }
                      </div>
                  </div>
              ) }
          </div>

          { /* Botões de ação: Mostrar form (preview), Cancelar e Salvar */ }
          <div className="flex flex-col md:flex-row justify-end gap-4 mb-4">
              <button
                  type="button"
                  onClick={ handleShowFormPreview }
                  className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded w-full md:w-auto"
              >
          Mostrar form
              </button>
              <button
                  type="button"
                  onClick={ onCancel }
                  className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded w-full md:w-auto"
              >
          Cancelar
              </button>
              <button
                  type="submit"
                  onClick={ handleSubmit }
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded w-full md:w-auto"
              >
          Salvar Cupom
              </button>
          </div>

          { /* Modais */ }
          { showCategoryModal && (
              <CategorySelectorModal
                  initialSelected={ selectedCategories }
                  onClose={ () => setShowCategoryModal(false) }
                  onConfirm={ (selected) => {
                      setSelectedCategories(selected);
                      setShowCategoryModal(false);
                  } }
              />
          ) }

          { showUserModal && (
              <UserSelectorModal
                  initialSelected={ selectedUsers }
                  onClose={ () => setShowUserModal(false) }
                  onConfirm={ (selected) => {
                      setSelectedUsers(selected);
                      setShowUserModal(false);
                  } }
              />
          ) }

          { showProductModal && (
              <ProductSelectorModal
                  initialSelected={ selectedProducts }
                  onClose={ () => setShowProductModal(false) }
                  onConfirm={ (selected) => {
                      setSelectedProducts(selected);
                      setShowProductModal(false);
                  } }
              />
          ) }
      </div>
  );
};

export default CouponForm;
