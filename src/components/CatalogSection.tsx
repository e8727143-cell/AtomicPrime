import React, { useState, useMemo } from 'react';
import { Product, ProductCategory, FilterState } from '../types';
import { ProductCard } from './ProductCard';
import { Search, SlidersHorizontal, X, Zap, ArrowLeft, ArrowRight, Sparkles } from 'lucide-react';

interface CatalogSectionProps {
  products: Product[];
  wishlistIds: string[];
  activeCategory: ProductCategory;
  onSelectCategory: (cat: ProductCategory) => void;
  onQuickView: (product: Product) => void;
  onAddToCart: (product: Product, size: 'S' | 'M' | 'L' | 'XL' | 'XXL' | '3XL') => void;
  onToggleWishlist: (product: Product) => void;
}

interface VerticalSectionConfig {
  id: ProductCategory;
  number: string;
  title: string;
  subtitle: string;
  tagline: string;
  badge: string;
  buttonLabel: string;
}

const VERTICAL_SECTIONS: VerticalSectionConfig[] = [
  {
    id: 'camiseta_oversize',
    number: '01',
    title: 'CAMISETAS OVERSIZE',
    subtitle: 'Oversize',
    tagline: 'Algodón peinado pesado 320 GSM · Caída cuadrada Boxy Fit · Cero transparencia',
    badge: '320 GSM HEAVYWEIGHT',
    buttonLabel: 'Ver todo el catálogo de Oversize',
  },
  {
    id: 'musculosa',
    number: '02',
    title: 'MUSCULOSAS & STRINGERS',
    subtitle: 'Musculosas',
    tagline: 'Corte Y-Back culturista · Sisa profunda y máxima libertad articular en dorsales',
    badge: 'Y-BACK BODYBUILDING',
    buttonLabel: 'Ver todo el catálogo de Musculosas',
  },
  {
    id: 'camiseta',
    number: '03',
    title: 'CAMISETAS ATHLETIC FIT',
    subtitle: 'Camisetas',
    tagline: 'Ajuste anatómico ceñido en bíceps y hombros · Algodón peinado elástico de alto retorno',
    badge: 'ATHLETIC MUSCLE FIT',
    buttonLabel: 'Ver todo el catálogo de Camisetas',
  },
  {
    id: 'bermuda',
    number: '04',
    title: 'BERMUDAS & SHORTS',
    subtitle: 'Bermudas',
    tagline: 'Liner compresor integrado 2-en-1 · Movilidad total en sentadilla profunda sin atascos',
    badge: 'SQUAT READY 5"',
    buttonLabel: 'Ver todo el catálogo de Bermudas',
  },
  {
    id: 'pantalon',
    number: '05',
    title: 'PANTALONES & JOGGERS',
    subtitle: 'Pantalones',
    tagline: 'Felpa francesa densa 380 GSM · Cono tapered anti-enganche en barra de peso muerto',
    badge: '380 GSM FRENCH TERRY',
    buttonLabel: 'Ver todo el catálogo de Pantalones',
  },
];

export const CatalogSection: React.FC<CatalogSectionProps> = ({
  products,
  wishlistIds,
  activeCategory,
  onSelectCategory,
  onQuickView,
  onAddToCart,
  onToggleWishlist,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCollection, setSelectedCollection] = useState<string>('all');
  const [selectedFit, setSelectedFit] = useState<string>('all');
  const [sortBy, setSortBy] = useState<FilterState['sortBy']>('featured');

  // Filtered products for dedicated category view or global search
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        if (activeCategory !== 'all' && p.category !== activeCategory) return false;
        if (selectedCollection !== 'all' && p.collection !== selectedCollection) return false;
        if (selectedFit !== 'all' && p.fit !== selectedFit) return false;
        if (searchQuery.trim() !== '') {
          const q = searchQuery.toLowerCase();
          const matchName = p.name.toLowerCase().includes(q);
          const matchDesc = p.description.toLowerCase().includes(q);
          const matchTagline = p.tagline.toLowerCase().includes(q);
          const matchCat = p.categoryLabel.toLowerCase().includes(q);
          if (!matchName && !matchDesc && !matchTagline && !matchCat) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price_asc') return a.price - b.price;
        if (sortBy === 'price_desc') return b.price - a.price;
        if (sortBy === 'rating') return b.rating - a.rating;
        if (sortBy === 'newest') return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
        return 0;
      });
  }, [products, activeCategory, selectedCollection, selectedFit, searchQuery, sortBy]);

  const handleClearFilters = () => {
    onSelectCategory('all');
    setSelectedCollection('all');
    setSelectedFit('all');
    setSearchQuery('');
    setSortBy('featured');
  };

  const handleCategoryClick = (cat: ProductCategory) => {
    onSelectCategory(cat);
    const el = document.getElementById('catalogo');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Helper to get top/popular product for a category in vertical layout
  const getCategoryTopProduct = (catId: ProductCategory): Product | undefined => {
    const catProducts = products.filter((p) => p.category === catId);
    return catProducts.find((p) => p.isBestseller) || catProducts[0];
  };

  const currentCategoryConfig = VERTICAL_SECTIONS.find((s) => s.id === activeCategory);

  const isVerticalFeedMode = activeCategory === 'all' && searchQuery.trim() === '';

  return (
    <section id="catalogo" className="py-10 sm:py-16 px-4 max-w-md md:max-w-6xl mx-auto scroll-mt-14">
      {/* 1. DEDICATED CATEGORY VIEW (When user clicks "Ver catálogo de...") */}
      {!isVerticalFeedMode ? (
        <div className="space-y-6">
          {/* Back to all sections bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-blue-950/70">
            <button
              onClick={() => onSelectCategory('all')}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-950/70 hover:bg-blue-900 border border-blue-600/50 text-cyan-300 font-heading font-bold text-xs uppercase tracking-wider transition-all active:scale-95 cursor-pointer shadow-[0_0_15px_rgba(0,120,255,0.25)]"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Volver a todas las secciones</span>
            </button>

            {/* Quick Category switcher pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 scrollbar-none">
              <button
                onClick={() => onSelectCategory('all')}
                className="px-3 py-1.5 rounded-lg text-xs font-mono uppercase tracking-wider bg-[#0a0c12] text-slate-400 hover:text-white border border-slate-800 shrink-0 cursor-pointer"
              >
                Todas las secciones
              </button>
              {VERTICAL_SECTIONS.map((sec) => {
                const isSelected = activeCategory === sec.id;
                return (
                  <button
                    key={sec.id}
                    onClick={() => onSelectCategory(sec.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono uppercase tracking-wider shrink-0 transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-blue-600 text-white font-bold border border-cyan-400/60 shadow-[0_0_10px_rgba(0,140,255,0.5)]'
                        : 'bg-[#0a0c12] text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    {sec.subtitle}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Category Banner Title */}
          <div className="p-5 sm:p-7 rounded-2xl bg-gradient-to-br from-[#0c101d] to-[#07080d] border border-blue-900/60 relative overflow-hidden shadow-[0_0_25px_rgba(0,102,255,0.15)]">
            <div className="absolute right-0 top-0 translate-x-6 -translate-y-6 w-44 h-44 rounded-full bg-blue-600/10 blur-3xl pointer-events-none" />
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-blue-950/80 border border-cyan-700/60 text-[10px] font-mono text-cyan-300 font-bold uppercase tracking-widest mb-2.5">
                <Sparkles className="w-3 h-3 text-cyan-400" />
                <span>CATÁLOGO COMPLETO</span>
                {currentCategoryConfig && <span>// {currentCategoryConfig.number}</span>}
              </div>
              <h2 className="text-2xl sm:text-4xl font-extrabold uppercase tracking-tight text-white">
                {currentCategoryConfig ? currentCategoryConfig.title : 'RESULTADOS DE BÚSQUEDA'}
              </h2>
              {currentCategoryConfig && (
                <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-2xl leading-relaxed">
                  {currentCategoryConfig.tagline}
                </p>
              )}
            </div>
          </div>

          {/* Search & Sort Controls within Category */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-[#090b10] border border-slate-900">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar prenda, modelo, GSM..."
                className="w-full h-10 pl-10 pr-9 bg-[#0e111a] border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Sort Selector */}
            <div className="flex items-center justify-between sm:justify-end gap-2">
              <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-400">
                <SlidersHorizontal className="w-3.5 h-3.5 text-cyan-400" />
                <span>Orden:</span>
              </div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as FilterState['sortBy'])}
                className="h-10 px-3 bg-[#0e111a] border border-slate-800 rounded-lg text-xs text-white font-mono focus:border-cyan-400 focus:outline-none"
              >
                <option value="featured">Destacados</option>
                <option value="price_asc">Menor Precio</option>
                <option value="price_desc">Mayor Precio</option>
                <option value="rating">Top Calificación</option>
                <option value="newest">Nuevos</option>
              </select>
            </div>
          </div>

          {/* Results Count */}
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span>
              Mostrando <strong className="text-white font-bold">{filteredProducts.length}</strong> opciones disponibles
            </span>
            <span className="text-cyan-400 text-[11px]">Envíos 24/48h a todo Uruguay</span>
          </div>

          {/* Grid of ALL options for this category */}
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  isWishlisted={wishlistIds.includes(product.id)}
                  onQuickView={onQuickView}
                  onAddToCart={onAddToCart}
                  onToggleWishlist={onToggleWishlist}
                />
              ))}
            </div>
          ) : (
            <div className="py-16 text-center rounded-2xl bg-[#090b10] border border-slate-900 p-6">
              <Zap className="w-10 h-10 text-blue-500/50 mx-auto mb-3" />
              <h3 className="font-heading text-lg font-bold text-white uppercase">
                No se encontraron opciones
              </h3>
              <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                No hay prendas que coincidan con la búsqueda dentro de esta categoría.
              </p>
              <button
                onClick={handleClearFilters}
                className="mt-5 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-heading font-bold text-xs uppercase tracking-wider rounded-xl transition-colors cursor-pointer"
              >
                Restablecer filtros
              </button>
            </div>
          )}

          {/* Bottom Back Button */}
          <div className="pt-6 text-center border-t border-slate-900">
            <button
              onClick={() => onSelectCategory('all')}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-950 hover:bg-blue-950 border border-slate-800 hover:border-cyan-500/50 text-slate-300 hover:text-white font-heading font-bold text-xs uppercase tracking-wider transition-all cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Volver a todas las secciones</span>
            </button>
          </div>
        </div>
      ) : (
        /* 2. VERTICAL FEED VIEW (Section by section, 1 featured product + "Ver catálogo de...") */
        <div className="space-y-14 sm:space-y-20">
          {/* Main Feed Header */}
          <div className="text-center max-w-xl mx-auto space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-950/80 border border-blue-700/60 text-[10px] font-mono font-bold tracking-widest uppercase text-cyan-300">
              <Zap className="w-3.5 h-3.5 fill-cyan-400 text-cyan-400" />
              <span>COLECCIÓN OFICIAL 2026</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white leading-tight">
              PRENDAS <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">HARDCORE</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Indumentaria culturista de alta densidad. Explora cada sección a continuación:
            </p>
          </div>

          {/* VERTICAL STACK OF THE 5 CATEGORIES */}
          <div className="space-y-16 sm:space-y-24">
            {VERTICAL_SECTIONS.map((section, index) => {
              const topProduct = getCategoryTopProduct(section.id);
              const totalInCategory = products.filter((p) => p.category === section.id).length;

              if (!topProduct) return null;

              return (
                <div
                  key={section.id}
                  className="relative rounded-3xl bg-gradient-to-b from-[#090b12] to-[#06070a] border border-blue-950/80 p-5 sm:p-8 shadow-[0_10px_35px_rgba(0,0,0,0.6)]"
                >
                  {/* Subtle top indicator beam */}
                  <div className="absolute top-0 left-8 right-8 h-[2px] bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />

                  {/* Section Title Header */}
                  <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6 pb-4 border-b border-slate-900">
                    <div>
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="font-mono text-xs font-bold text-cyan-400 bg-blue-950/90 px-2 py-0.5 rounded border border-blue-800/80">
                          SECCIÓN {section.number}
                        </span>
                        <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">
                          {section.badge}
                        </span>
                      </div>
                      <h3 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-white">
                        {section.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
                        {section.tagline}
                      </p>
                    </div>

                    <div className="text-[11px] font-mono text-slate-400 hidden sm:block shrink-0">
                      {totalInCategory} {totalInCategory === 1 ? 'modelo' : 'modelos'} en stock
                    </div>
                  </div>

                  {/* Section Single Featured Product (The most popular item) */}
                  <div className="max-w-md mx-auto">
                    <ProductCard
                      product={topProduct}
                      isWishlisted={wishlistIds.includes(topProduct.id)}
                      onQuickView={onQuickView}
                      onAddToCart={onAddToCart}
                      onToggleWishlist={onToggleWishlist}
                    />
                  </div>

                  {/* Section Action Button: "Ver todo el catálogo de..." */}
                  <div className="mt-6 text-center max-w-md mx-auto">
                    <button
                      onClick={() => handleCategoryClick(section.id)}
                      className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-blue-700 via-blue-600 to-cyan-600 hover:from-blue-600 hover:to-cyan-500 text-white font-heading font-bold text-xs sm:text-sm tracking-wider uppercase transition-all duration-200 active:scale-[0.98] shadow-[0_0_20px_rgba(0,102,255,0.45)] hover:shadow-[0_0_25px_rgba(0,180,255,0.6)] border border-cyan-400/40 flex items-center justify-center gap-2.5 cursor-pointer group"
                    >
                      <span>{section.buttonLabel}</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                    <span className="block mt-2 text-[10px] font-mono text-slate-500 uppercase tracking-wider">
                      Descubre todas las tallas, colores y cortes ({totalInCategory} opciones)
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
};
