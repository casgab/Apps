import React, { useState, useMemo, useCallback } from 'react';
import { LineItem } from './types';

const initialItem: LineItem = {
  id: crypto.randomUUID(),
  description: '',
  code: '',
  unitPrice: 0,
  quantity: 1,
  discount: 0,
};

// SVG icon component for the delete button
const TrashIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" />
  </svg>
);

const App: React.FC = () => {
  const [lineItems, setLineItems] = useState<LineItem[]>([initialItem]);

  const handleUpdateItem = useCallback((id: string, field: keyof Omit<LineItem, 'id'>, value: string) => {
    setLineItems(currentItems =>
      currentItems.map(item => {
        if (item.id === id) {
          const numericFields: (keyof Omit<LineItem, 'id'>)[] = ['unitPrice', 'quantity', 'discount'];
          if (numericFields.includes(field)) {
            const parsedValue = parseFloat(value);
            return { ...item, [field]: isNaN(parsedValue) ? 0 : parsedValue };
          }
          return { ...item, [field]: value };
        }
        return item;
      })
    );
  }, []);

  const handleAddItem = useCallback(() => {
    setLineItems(currentItems => [
      ...currentItems,
      {
        id: crypto.randomUUID(),
        description: '',
        code: '',
        unitPrice: 0,
        quantity: 1,
        discount: 0,
      },
    ]);
  }, []);

  const handleDeleteItem = useCallback((id: string) => {
    setLineItems(currentItems => {
        if (currentItems.length === 1) return currentItems; // Prevent deleting the last row
        return currentItems.filter(item => item.id !== id);
    });
  }, []);

  const grandTotal = useMemo(() => {
    return lineItems.reduce((total, item) => {
      const importe = item.unitPrice * item.quantity;
      const discountAmount = importe * (item.discount / 100);
      const subtotal = importe - discountAmount;
      return total + subtotal;
    }, 0);
  }, [lineItems]);
  
  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans p-4 sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-sky-400">Calculadora de Compras Rápida</h1>
          <p className="text-gray-400 mt-2">Cree líneas de compra de forma rápida y sencilla.</p>
        </header>

        <main className="bg-gray-800 rounded-xl shadow-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1000px] text-sm text-left">
              <thead className="bg-sky-600 text-white uppercase tracking-wider text-xs">
                <tr>
                  <th scope="col" className="p-4 w-4/12">Descripción</th>
                  <th scope="col" className="p-4 w-[12.5%]">Código</th>
                  <th scope="col" className="p-4 w-[12.5%] text-right">Precio Unit.</th>
                  <th scope="col" className="p-4 w-1/12 text-center">Cantidad</th>
                  <th scope="col" className="p-4 w-1/12 text-right">Importe</th>
                  <th scope="col" className="p-4 w-1/12 text-center">Descuento (%)</th>
                  <th scope="col" className="p-4 w-1/12 text-right">Subtotal</th>
                  <th scope="col" className="p-4 w-[5%] text-center">Acción</th>
                </tr>
              </thead>
              <tbody>
                {lineItems.map((item, index) => {
                  const importe = item.unitPrice * item.quantity;
                  const discountAmount = importe * (item.discount / 100);
                  const subtotal = importe - discountAmount;
                  
                  return (
                    <tr key={item.id} className="bg-gray-700 border-b border-gray-600 hover:bg-gray-600/50 transition-colors duration-200">
                      <td className="p-2">
                        <input
                          type="text"
                          value={item.description}
                          onChange={(e) => handleUpdateItem(item.id, 'description', e.target.value)}
                          placeholder="Descripción del producto"
                          className="w-full bg-gray-800 border border-gray-600 rounded-md px-3 py-2 text-yellow-200 focus:outline-none focus:ring-2 focus:ring-sky-500"
                        />
                      </td>
                      <td className="p-2">
                        <input
                          type="text"
                          value={item.code}
                          onChange={(e) => handleUpdateItem(item.id, 'code', e.target.value)}
                          placeholder="Código o SKU"
                          className="w-full bg-gray-800 border border-gray-600 rounded-md px-3 py-2 text-yellow-200 focus:outline-none focus:ring-2 focus:ring-sky-500"
                        />
                      </td>
                      <td className="p-2">
                        <input
                          type="number"
                          value={item.unitPrice}
                          onChange={(e) => handleUpdateItem(item.id, 'unitPrice', e.target.value)}
                          placeholder="0.00"
                          min="0"
                          step="0.01"
                          className="w-full bg-gray-800 border border-gray-600 rounded-md px-3 py-2 text-right text-yellow-200 focus:outline-none focus:ring-2 focus:ring-sky-500"
                        />
                      </td>
                      <td className="p-2">
                         <input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => handleUpdateItem(item.id, 'quantity', e.target.value)}
                          placeholder="1"
                          min="0"
                          className="w-full bg-gray-800 border border-gray-600 rounded-md px-3 py-2 text-center text-yellow-200 focus:outline-none focus:ring-2 focus:ring-sky-500"
                        />
                      </td>
                      <td className="p-2 text-right align-middle text-gray-300 font-mono">{formatCurrency(importe)}</td>
                       <td className="p-2">
                         <input
                          type="number"
                          value={item.discount}
                          onChange={(e) => handleUpdateItem(item.id, 'discount', e.target.value)}
                          placeholder="0"
                          min="0"
                          max="100"
                          className="w-full bg-gray-800 border border-gray-600 rounded-md px-3 py-2 text-center text-yellow-200 focus:outline-none focus:ring-2 focus:ring-sky-500"
                        />
                      </td>
                      <td className="p-2 text-right align-middle text-sky-400 font-semibold font-mono">{formatCurrency(subtotal)}</td>
                      <td className="p-2 text-center align-middle">
                        <button
                          onClick={() => handleDeleteItem(item.id)}
                          disabled={lineItems.length <= 1}
                          className="text-gray-400 hover:text-red-500 disabled:text-gray-600 disabled:cursor-not-allowed transition-colors duration-200 p-2 rounded-full hover:bg-gray-700"
                          aria-label="Eliminar línea"
                        >
                          <TrashIcon />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="p-4 flex flex-col sm:flex-row justify-between items-center bg-gray-800/50 border-t border-gray-700/50">
             <button
              onClick={handleAddItem}
              className="w-full sm:w-auto bg-sky-600 hover:bg-sky-500 text-white font-bold py-2 px-4 rounded-md transition-all duration-300 ease-in-out transform hover:scale-105 shadow-lg mb-4 sm:mb-0"
            >
              + Añadir Línea
            </button>
            <div className="text-right">
              <span className="text-gray-400 text-lg">Total General:</span>
              <span className="ml-4 text-3xl font-bold text-green-400 tracking-wider font-mono">
                {formatCurrency(grandTotal)}
              </span>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
