{/* ... (skoro celý súbor ostáva rovnaký, mení sa len táto časť) */}

      {/* ... v header sekcii namiesto "Cena na víkend (2 dni)" ... */}
      <div className="pt-2 border-t border-white/5">
        <span className="text-xs text-gray-400 uppercase font-bold block">Cena na deň:</span>
        <div className="flex items-baseline gap-2">
          <span className="text-[#BD20D3] font-extrabold text-3xl">{totalPerDay} €</span>
          <span className="text-gray-400 text-xs">/ deň</span>
        </div>
        <div className="flex items-baseline gap-1 mt-1">
          <span className="text-xs text-gray-500">Cena na víkend (2 dni):</span>
          <span className="text-[#1A4BFF] font-bold text-lg">{totalWeekend} €</span>
        </div>
        {includeLights && (
          <p className="text-emerald-400 text-xs mt-1">
            Ušetríte {(selectedPackage.priceNoLights + selectedPackage.priceWithLights) - activePackagePrice} € oproti objednaniu zvlášť
          </p>
        )}
      </div>

      {/* ... v booking forme namiesto "Cena na víkend:" ... */}
      <p className="text-xs text-[#1A4BFF] font-bold">
        Cena na víkend: {totalWeekend.toFixed(2)} €
      </p>

      {/* ... v súhrne cien dole ... */}
      <div className="flex justify-between text-sm font-bold border-t border-[#BD20D3]/20 pt-2 mt-2">
        <span className="text-white">Cena na deň:</span>
        <span className="text-[#BD20D3] text-xl">{totalPerDay.toFixed(2)} €</span>
      </div>
      
      <div className="flex justify-between text-sm font-bold">
        <span className="text-white flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-[#1A4BFF]"></span>
          Cena na víkend (2 dni):
        </span>
        <span className="text-[#1A4BFF] text-2xl font-extrabold">{totalWeekend.toFixed(2)} €</span>
      </div>