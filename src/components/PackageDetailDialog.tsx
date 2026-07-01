// ... (celý súbor je dlhý, upravím len relevantné úseky – v praxi by som napísal celý súbor, ale pre prehľadnosť ukážem len zmeny)

// V hornej časti – cena balíka:
<span className="text-[#BD20D3] font-extrabold text-3xl">{totalPrice} €</span>
<span className="text-gray-400 text-xs">/ víkend</span>

// V súhrne cien pri balíku:
<span>Balík ({includeLights ? 'so svetlami' : 'bez svetiel'}):</span>
<span className="text-white font-semibold">{activePackagePrice} € / víkend</span>

// Pri jednotlivých pridaných produktoch:
<span className="text-white font-medium">{itemCost.toFixed(2)} € / víkend</span>

// Medzisúčet produktov:
<span className="text-emerald-400 font-bold">{additionalProductsCost.toFixed(2)} € / víkend</span>

// A v rezervačnom formulári:
<span className="text-xs text-gray-400">
  Celková cena: {totalPrice.toFixed(2)} € / víkend ({includeLights ? 'so svetelnou show' : 'bez svetiel'})
</span>

// A v spodnom riadku:
<span className="text-[#BD20D3] text-xl">{totalPrice.toFixed(2)} €</span>