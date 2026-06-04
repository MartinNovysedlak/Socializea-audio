"use client";

import React, { useState } from "react";
import { Filter } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Minus, Plus } from "lucide-react";

interface EquipmentItem {
  id: string;
  name: string;
  category: "sound" | "lighting" | "other";
  pricePerDay: number;
  available: number;
  image: string;
}

// Map uploaded filenames to equipment IDs
const imageMap: Record<string, string> = {
  "4-share.jpg": "mixer-x1222",
  "8ad9b834756278363ba501b7aedf9399bc1ad25a_original.jpeg": "mixer-802",
  "12-12w-12-18w-Led-Par-Light-RGBW-RGBWA-UV-4in1-6in1-Flat-Par-Light-DMX512.jpg": "led-par",
  "60aaed4d-3ca9-4c33-9f0f-86e7e5656262.jfif": "mic-set",
  "61jOFLWAskS._AC_SL1500_.jpg": "mic-auna",
  "61UhrM+sGkL.jpg": "speakers-b112d",
  "81FyY7p2joL.jpg": "speaker-b208d",
  "371a68e5-ac3f-41f6-a8d8-278481489898.jpg": "sub-b1500xp",
  "717kj+PEWhL._AC_UF1000,1000_QL80_.jpg": "sub-dsp18",
  "887ed9_d483db86d97b4f21b9e472b145e6d3a7~mv2.webp": "dmx-pult",
  "5973-1_projekcne-prenosne-promitaciou-platno-16-9-na-projektor-100--s-regulovatelnym-stativom-domace-kino-interier-a-exterier-film.webp": "projector",
  "181547-superlarge_default.jpg": "screen",
  "387288.jpg": "light-construct",
  "10010798_yy_0001_titel___aunapro_UHF_550_Quartett3_4_Kanal_Funkmikrofon_Set_reedit.webp": "mic-stand",
  "10026458_yy_0001_titel___aunapro_Duett_Quartett_Fix_V2_UHF_Funkmikrofon_Set_reedit.webp": "tripod",
  "10034470_yy_0001_titel___auna_UHF200C_2B.jpg": "speaker-mount",
  "11659643_800.jpg": "telescopic",
  "14406264_800.jpg": "uv-lights",
  "18648447_800.jpg": "strobe",
  "154489270.jpg": "fire",
  "adj_bubbletron_thedjshop.jpg": "bubble",
  "beamz-party-bar.jpg": "party-bar",
  "beamz-sushi-ds-dmx-rozrhranie.jpg": "beam-head",
  "Behringer_B112D_Package.jpg": "mixer-x1222",
  "bespeco-sh56.jpg": "mic-set",
  "BEXENYXX1222USB-03.jpg": "mixer-802",
  "da62e99f-837c-48ec-bb5f-94b01a8c2d0b.jpg": "sub-dsp18",
  "f7a536794209461fca10a56869dc754f--mmf400x400.jpg": "uv-lights",
  "flash-led-par-36-12x-uv.jpg": "led-par",
  "H95f0d586d3db41e1a6f558deca6d60cdo.jpg": "uv-lights",
  "image_2_70178.jpg": "uv-lights",
  "main_a59f8bcb.jpg": "uv-lights",
  "premietacie_platno-prenajom.jpeg": "screen",
  "preview.jpg": "uv-lights",
  "small_bespeco-pn90xlno-teleskopicky-repro-stoj.jpg": "telescopic",
  "small_bose-sub1-sub2-adjustable-speaker-pole.jpg": "sub-dsp18",
  "Snímka obrazovky 2024-10-04 092709.png": "uv-lights",
  "Snímka obrazovky 2024-10-04 093124.png": "uv-lights",
  "Snímka obrazovky 2024-10-04 093417.png": "uv-lights",
  "stojan-na-mikrofon-182cm.jpg": "mic-stand",
  "unnamed.jpg": "uv-lights",
  "wanbo-t6-max-cover-ovladac.jpg": "projector",
};

const equipmentData: EquipmentItem[] = [
  // Sound
  {
    id: "mixer-x1222",
    name: "Mixážny pult Behringer Xenyx X1222 USB",
    category: "sound",
    pricePerDay: 25,
    available: 1,
    image: `/Prenajom/${imageMap["BEXENYXX1222USB-03.jpg"]}`,
  },
  {
    id: "mixer-802",
    name: "Mixážny pult Behringer Xenyx 802",
    category: "sound",
    pricePerDay: 15,
    available: 1,
    image: `/Prenajom/${imageMap["8ad9b834756278363ba501b7aedf9399bc1ad25a_original.jpeg"]}`,
  },
  {
    id: "mic-set",
    name: "Sada 2 mikrofónov the t.bone free solo Twin HT",
    category: "sound",
    pricePerDay: 20,
    available: 1,
    image: `/Prenajom/${imageMap["da62e99f-837c-48ec-bb5f-94b01a8c2d0b.jpg"]}`,
  },
  {
    id: "mic-auna",
    name: "Mikrofony a headsety Auna VHF",
    category: "sound",
    pricePerDay: 10,
    available: 4,
    image: `/Prenajom/${imageMap["10034470_yy_0001_titel___auna_UHF200C_2B.jpg"]}`,
  },
  {
    id: "speakers-b112d",
    name: "Reproduktory Behringer b112d",
    category: "sound",
    pricePerDay: 15,
    available: 4,
    image: `/Prenajom/${imageMap["Behringer_B112D_Package.jpg"]}`,
  },
  {
    id: "speaker-b208d",
    name: "Reproduktor Behringer b208d",
    category: "sound",
    pricePerDay: 12,
    available: 1,
    image: `/Prenajom/${imageMap["61UhrM+sGkL.jpg"]}`,
  },
  {
    id: "sub-b1500xp",
    name: "Subwoofery Behriger B1500XP",
    category: "sound",
    pricePerDay: 30,
    available: 2,
    image: `/Prenajom/${imageMap["387288.jpg"]}`,
  },
  {
    id: "sub-dsp18",
    name: "Subwoofer The Box Pro DSP 18 Sub",
    category: "sound",
    pricePerDay: 35,
    available: 5,
    image: `/Prenajom/${imageMap["717kj+PEWhL._AC_UF1000,1000_QL80_.jpg"]}`,
  },

  // Lighting
  {
    id: "dmx-pult",
    name: "Riadiaci DMX pult Light4Me DMX 192",
    category: "lighting",
    pricePerDay: 20,
    available: 1,
    image: `/Prenajom/${imageMap["887ed9_d483db86d97b4f21b9e472b145e6d3a7~mv2.webp"]}`,
  },
  {
    id: "led-par",
    name: "RGBWA UV Led Par svetlá",
    category: "lighting",
    pricePerDay: 8,
    available: 8,
    image: `/Prenajom/${imageMap["12-12w-12-18w-Led-Par-Light-RGBW-RGBWA-UV-4in1-6in1-Flat-Par-Light-DMX512.jpg"]}`,
  },
  {
    id: "beam-head",
    name: "Rotujúca 90w Beam hlava",
    category: "lighting",
    pricePerDay: 25,
    available: 4,
    image: `/Prenajom/${imageMap["61jOFLWAskS._AC_SL1500_.jpg"]}`,
  },
  {
    id: "uv-lights",
    name: "Samostatné Bodové UV svetlá",
    category: "lighting",
    pricePerDay: 10,
    available: 2,
    image: `/Prenajom/${imageMap["4-share.jpg"]}`,
  },

  // Other
  {
    id: "projector",
    name: "Premietačka Wanbo T6 MAX",
    category: "other",
    pricePerDay: 20,
    available: 1,
    image: `/Prenajom/${imageMap["wanbo-t6-max-cover-ovladac.jpg"]}`,
  },
  {
    id: "screen",
    name: "Premietacie plátno 110\"",
    category: "other",
    pricePerDay: 15,
    available: 1,
    image: `/Prenajom/${imageMap["5973-1_projekcne-prenosne-promitaciou-platno-16-9-na-projektor-100--s-regulovatelnym-stativom-domace-kino-interier-a-exterier-film.webp"]}`,
  },
  {
    id: "light-construct",
    name: "Osvetľovacia konštrukcia na uchytenie",
    category: "other",
    pricePerDay: 10,
    available: 1,
    image: `/Prenajom/${imageMap["181547-superlarge_default.jpg"]}`,
  },
  {
    id: "mic-stand",
    name: "Stojan na mikrofón",
    category: "other",
    pricePerDay: 5,
    available: 2,
    image: `/Prenajom/${imageMap["10010798_yy_0001_titel___aunapro_UHF_550_Quartett3_4_Kanal_Funkmikrofon_Set_reedit.webp"]}`,
  },
  {
    id: "tripod",
    name: "Trojnožka na reproduktory",
    category: "other",
    pricePerDay: 10,
    available: 2,
    image: `/Prenajom/${imageMap["small_bespeco-pn90xlno-teleskopicky-repro-stoj.jpg"]}`,
  },
  {
    id: "speaker-mount",
    name: "Držiak pre dvojicu reproboxov",
    category: "other",
    pricePerDay: 5,
    available: 2,
    image: `/Prenajom/${imageMap["small_bose-sub1-sub2-adjustable-speaker-pole.jpg"]}`,
  },
  {
    id: "telescopic",
    name: "Teleskopická stojanová tyč",
    category: "other",
    pricePerDay: 8,
    available: 2,
    image: `/Prenajom/${imageMap["stojan-na-mikrofon-182cm.jpg"]}`,
  },
  {
    id: "bubble",
    name: "Bublinkostroj",
    category: "other",
    pricePerDay: 20,
    available: 2,
    image: `/Prenajom/${imageMap["adj_bubbletron_thedjshop.jpg"]}`,
  },
  {
    id: "party-bar",
    name: "Svetlá BeamZ Party Bar",
    category: "other",
    pricePerDay: 20,
    available: 1,
    image: `/Prenajom/${imageMap["beamz-party-bar.jpg"]}`,
  },
  {
    id: "strobe",
    name: "Stroboskop",
    category: "other",
    pricePerDay: 15,
    available: 1,
    image: `/Prenajom/${imageMap["14406264_800.jpg"]}`,
  },
  {
    id: "fire",
    name: "Výrobníky plameňov Fire Machine",
    category: "other",
    pricePerDay: 30,
    available: 2,
    image: `/Prenajom/${imageMap["18648447_800.jpg"]}`,
  },
];

const EquipmentCatalog = () => {
  const [activeFilter, setActiveFilter] = useState<"all" | "sound" | "lighting" | "other">(
    "all"
  );
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  const filteredEquipment =
    activeFilter === "all"
      ? equipmentData
      : equipmentData.filter((item) => item.category === activeFilter);

  const handleQuantityChange = (id: string, delta: number) => {
    const item = equipmentData.find((i) => i.id === id);
    const currentQty = quantities[id] ?? 0;
    const newQty = Math.max(
      0,
      Math.min(item?.available ?? 0, currentQty + delta)
    );
    setQuantities((prev) => ({ ...prev, [id]: newQty }));
  };

  const handleAdd = (id: string) => {
    handleQuantityChange(id, 1);
  };

  const handleRemove = (id: string) => {
    handleQuantityChange(id, -1);
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case "sound":
        return "Zvuk";
      case "lighting":
        return "Svetlá a efekty";
      case "other":
        return "Ostatné";
      default:
        return "";
    }
  };

  const getAvailabilityText = (available: number) => {
    return `${available} ${available === 1 ? "kus" : "kusy"}`;
  };

  const getTotalSum = () => {
    return Object.entries(quantities).reduce((sum, [id, qty]) => {
      const item = equipmentData.find((i) => i.id === id);
      return sum + (item ? item.pricePerDay * qty : 0);
    }, 0);
  };

  return (
    <section className="py-12 bg-[#020721] relative">
      <div className="container mx-auto px-4">
        <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 md:p-16 backdrop-blur-xl">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
                  Ponuka aparatúry
                </h2>
                <p className="text-gray-400">
                  Vyberte si jednotlivé položky a pridajte ich do kalkulačky
                </p>
              </div>

              <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-full p-2">
                <Filter className="text-[#BD20D3] ml-3" size={18} />
                <div className="flex gap-1">
                  {["all", "sound", "lighting", "other"].map((filter) => (
                    <button
                      key={filter}
                      onClick={() => setActiveFilter(filter)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                        activeFilter === filter
                          ? "bg-[#BD20D3] text-white"
                          : "text-gray-400 hover:text-white hover:bg-white/10"
                      }`}
                    >
                      {filter === "all" ? "Všetko" : getCategoryLabel(filter)}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Centered Total Sum */}
            <div className="mb-8 text-center">
              <div className="inline-block bg-[#BD20D3]/20 border border-[#BD20D3]/40 rounded-full px-8 py-3">
                <span className="text-[#BD20D3] font-bold text-lg">
                  Celková suma: {getTotalSum()} €
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEquipment.map((item) => (
                <Link
                  key={item.id}
                  to={`/equipment/${item.id}`}
                  className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col items-center text-center hover:border-[#BD20D3]/30 hover:translate-y-[-4px] transition-all duration-300 cursor-pointer group"
                >
                  <div className="w-32 h-32 rounded-2xl overflow-hidden border border-white/10 relative mb-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-transform duration-300"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "https://via.placeholder.com/128?text=No+Image";
                      }}
                      style={{ objectPosition: "center" }}
                    />
                    <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-[#BD20D3]/20 rounded-full px-3 py-1">
                      <span className="text-xs font-medium text-[#BD20D3] whitespace-nowrap">
                        {getCategoryLabel(item.category)}
                      </span>
                    </div>
                  </div>

                  <div className="flex-1 w-full">
                    <h3 className="text-lg font-semibold text-white group-hover:text-[#BD20D3] transition-colors mb-2">
                      {item.name}
                    </h3>

                    <div className="flex justify-center items-center gap-3 mb-3">
                      <span className="text-2xl font-bold text-[#BD20D3]">{item.pricePerDay} €</span>
                      <span className="text-gray-400 text-sm">
                        Dostupné: {getAvailabilityText(item.available)}
                      </span>
                    </div>

                    <Button
                      size="sm"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                      className="w-full bg-[#BD20D3]/20 hover:bg-[#BD20D3]/30 text-[#BD20D3] border border-[#BD20D3]/40 rounded-lg h-10 mb-4"
                      disabled={!quantities[item.id]}
                    >
                      Pridať do kalkulácie
                    </Button>

                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleRemove(item.id);
                        }}
                        disabled={!quantities[item.id]}
                        className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="w-10 text-center text-white font-medium text-base">
                        {quantities[item.id] ?? 0}
                      </span>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleAdd(item.id);
                        }}
                        disabled={(quantities[item.id] ?? 0) >= item.available}
                        className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EquipmentCatalog;