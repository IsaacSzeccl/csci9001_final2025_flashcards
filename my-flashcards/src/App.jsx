import React, { useState, useEffect, useCallback, useRef } from 'react';
import { BookOpen, Check, X, RotateCw, BarChart2, RefreshCw, Trophy, AlertTriangle, List, Layers, Bookmark, Download, Trash2, Play, Upload, PenTool } from 'lucide-react';

const STORAGE_KEY = 'chinese-flashcards-data-v2'; // Version 2 for combined structure
const STREAK_KEY = 'chinese-flashcards-streak-v2';

// 1. Vocabulary Data (字詞辨正) - Embedded directly to avoid import errors
const initialVocabulary = [
  { id: 1, type: 'vocab', wrong: "畢挺", correct: "筆挺" },
  { id: 2, type: 'vocab', wrong: "豐采", correct: "風采" },
  { id: 3, type: 'vocab', wrong: "煩燥", correct: "煩躁" },
  { id: 4, type: 'vocab', wrong: "乾躁", correct: "乾燥" },
  { id: 5, type: 'vocab', wrong: "眈誤", correct: "耽誤" },
  { id: 6, type: 'vocab', wrong: "隱若", correct: "隱約" },
  { id: 7, type: 'vocab', wrong: "手飾", correct: "首飾" },
  { id: 8, type: 'vocab', wrong: "清淅", correct: "清晰" },
  { id: 9, type: 'vocab', wrong: "辨論", correct: "辯論" },
  { id: 10, type: 'vocab', wrong: "浪廢", correct: "浪費" },
  { id: 11, type: 'vocab', wrong: "巳經", correct: "已經" },
  { id: 12, type: 'vocab', wrong: "熟識", correct: "熟悉" },
  { id: 13, type: 'vocab', wrong: "反醒", correct: "反省" },
  { id: 14, type: 'vocab', wrong: "零晨", correct: "凌晨" },
  { id: 15, type: 'vocab', wrong: "介指", correct: "戒指" },
  { id: 16, type: 'vocab', wrong: "前題", correct: "前提" },
  { id: 17, type: 'vocab', wrong: "殺戳", correct: "殺戮" },
  { id: 18, type: 'vocab', wrong: "進升", correct: "晉升" },
  { id: 19, type: 'vocab', wrong: "制抓", correct: "掣肘" },
  { id: 20, type: 'vocab', wrong: "媒界", correct: "媒介" },
  { id: 21, type: 'vocab', wrong: "岐路", correct: "歧路" },
  { id: 22, type: 'vocab', wrong: "鑲鉗", correct: "鑲嵌" },
  { id: 23, type: 'vocab', wrong: "堪察", correct: "勘察" },
  { id: 24, type: 'vocab', wrong: "嚴竣", correct: "嚴峻" }, 
  { id: 25, type: 'vocab', wrong: "完竢", correct: "完竣" },
  { id: 26, type: 'vocab', wrong: "膺品", correct: "贗品" },
  { id: 27, type: 'vocab', wrong: "拆扣", correct: "折扣" },
  { id: 28, type: 'vocab', wrong: "規距", correct: "規矩" },
  { id: 29, type: 'vocab', wrong: "修緝", correct: "修葺" },
  { id: 30, type: 'vocab', wrong: "攝足", correct: "躡足" },
  { id: 31, type: 'vocab', wrong: "智識", correct: "知識" },
  { id: 32, type: 'vocab', wrong: "慎密", correct: "縝密" },
  { id: 33, type: 'vocab', wrong: "誦揚", correct: "頌揚" },
  { id: 34, type: 'vocab', wrong: "鬼計", correct: "詭計" },
  { id: 35, type: 'vocab', wrong: "喧染", correct: "渲染" },
  { id: 36, type: 'vocab', wrong: "顯注", correct: "顯著" },
  { id: 37, type: 'vocab', wrong: "蒙閉", correct: "蒙蔽" },
  { id: 38, type: 'vocab', wrong: "蜂湧", correct: "蜂擁" },
  { id: 39, type: 'vocab', wrong: "防礙", correct: "妨礙" },
  { id: 40, type: 'vocab', wrong: "助慶", correct: "助興" },
  { id: 41, type: 'vocab', wrong: "婉惜", correct: "惋惜" },
  { id: 42, type: 'vocab', wrong: "盤倨", correct: "盤踞" },
  { id: 43, type: 'vocab', wrong: "詳程", correct: "詳情" },
  { id: 44, type: 'vocab', wrong: "腐杇", correct: "腐朽" },
  { id: 45, type: 'vocab', wrong: "服待", correct: "服侍" },
  { id: 46, type: 'vocab', wrong: "脈胳", correct: "脈絡" },
  { id: 47, type: 'vocab', wrong: "轄免", correct: "豁免" },
  { id: 48, type: 'vocab', wrong: "藉貫", correct: "籍貫" },
  { id: 49, type: 'vocab', wrong: "陶治", correct: "陶冶" },
  { id: 50, type: 'vocab', wrong: "熟諗", correct: "熟稔" },
  { id: 51, type: 'vocab', wrong: "貫輸", correct: "灌輸" },
  { id: 52, type: 'vocab', wrong: "真締", correct: "真諦" },
  { id: 53, type: 'vocab', wrong: "移平", correct: "夷平" },
  { id: 54, type: 'vocab', wrong: "商確", correct: "商榷" },
  { id: 55, type: 'vocab', wrong: "鎖碎", correct: "瑣碎" },
  { id: 56, type: 'vocab', wrong: "壓止", correct: "遏止" },
  { id: 57, type: 'vocab', wrong: "演譯", correct: "演繹" },
  { id: 58, type: 'vocab', wrong: "縻爛", correct: "糜爛" },
  { id: 59, type: 'vocab', wrong: "燿燦", correct: "璀璨" },
  { id: 60, type: 'vocab', wrong: "安祥", correct: "安詳" },
  { id: 61, type: 'vocab', wrong: "端祥", correct: "端詳" },
  { id: 62, type: 'vocab', wrong: "慈詳", correct: "慈祥" },
  { id: 63, type: 'vocab', wrong: "記託", correct: "寄託" },
  { id: 64, type: 'vocab', wrong: "撒退", correct: "撤退" },
  { id: 65, type: 'vocab', wrong: "鬆馳", correct: "鬆弛" },
  { id: 66, type: 'vocab', wrong: "弛名", correct: "馳名" },
  { id: 67, type: 'vocab', wrong: "震奮", correct: "振奮" },
  { id: 68, type: 'vocab', wrong: "催速", correct: "催促" },
  { id: 69, type: 'vocab', wrong: "跟據", correct: "根據" },
  { id: 70, type: 'vocab', wrong: "骨格", correct: "骨骼" },
  { id: 71, type: 'vocab', wrong: "鬼崇", correct: "鬼祟" },
  { id: 72, type: 'vocab', wrong: "捆搏", correct: "捆縛" },
  { id: 73, type: 'vocab', wrong: "蘊釀", correct: "醞釀" },
  { id: 74, type: 'vocab', wrong: "恐佈", correct: "恐怖" },
  { id: 75, type: 'vocab', wrong: "切想", correct: "設想" },
  { id: 76, type: 'vocab', wrong: "食不裹腹", correct: "食不果腹" },
  { id: 77, type: 'vocab', wrong: "妄自非薄", correct: "妄自菲薄" },
  { id: 78, type: 'vocab', wrong: "名列前矛", correct: "名列前茅" },
  { id: 79, type: 'vocab', wrong: "舉旗不定", correct: "舉棋不定" },
  { id: 80, type: 'vocab', wrong: "肝腦途地", correct: "肝腦塗地" },
  { id: 81, type: 'vocab', wrong: "群英會萃", correct: "群英薈萃" },
  { id: 82, type: 'vocab', wrong: "援兵之計", correct: "緩兵之計" },
  { id: 83, type: 'vocab', wrong: "心繁意亂", correct: "心煩意亂" },
  { id: 84, type: 'vocab', wrong: "挺而走險", correct: "鋌而走險" },
  { id: 85, type: 'vocab', wrong: "遍體麟傷", correct: "遍體鱗傷" },
  { id: 86, type: 'vocab', wrong: "燴炙人口", correct: "膾炙人口" },
  { id: 87, type: 'vocab', wrong: "生死悠關", correct: "生死攸關" },
  { id: 88, type: 'vocab', wrong: "卧新嘗膽", correct: "卧薪嘗膽" },
  { id: 89, type: 'vocab', wrong: "維維諾諾", correct: "唯唯諾諾" },
  { id: 90, type: 'vocab', wrong: "晃然大悟", correct: "恍然大悟" },
  { id: 91, type: 'vocab', wrong: "走頭無路", correct: "走投無路" },
  { id: 92, type: 'vocab', wrong: "不卑不抗", correct: "不卑不亢" },
  { id: 93, type: 'vocab', wrong: "怨天由人", correct: "怨天尤人" },
  { id: 94, type: 'vocab', wrong: "好高鶩遠", correct: "好高騖遠" },
  { id: 95, type: 'vocab', wrong: "按步就班", correct: "按部就班" },
  { id: 96, type: 'vocab', wrong: "矚目驚心", correct: "觸目驚心" },
  { id: 97, type: 'vocab', wrong: "以逸代勞", correct: "以逸待勞" },
  { id: 98, type: 'vocab', wrong: "不醒人事", correct: "不省人事" },
  { id: 99, type: 'vocab', wrong: "無是生非", correct: "無事生非" },
  { id: 100, type: 'vocab', wrong: "穿流不息", correct: "川流不息" },
  { id: 101, type: 'vocab', wrong: "沮擊", correct: "狙擊" },
  { id: 102, type: 'vocab', wrong: "嘗光", correct: "賞光" },
  { id: 103, type: 'vocab', wrong: "公孥", correct: "公帑" },
  { id: 104, type: 'vocab', wrong: "叼嘮", correct: "叨嘮" },
  { id: 105, type: 'vocab', wrong: "變掛", correct: "變卦" },
  { id: 106, type: 'vocab', wrong: "事誼", correct: "事宜" },
  { id: 107, type: 'vocab', wrong: "符會", correct: "附會" },
  { id: 108, type: 'vocab', wrong: "繁植", correct: "繁殖" },
  { id: 109, type: 'vocab', wrong: "袒率", correct: "坦率" },
  { id: 110, type: 'vocab', wrong: "袒誠", correct: "坦誠" },
  { id: 111, type: 'vocab', wrong: "遲頓", correct: "遲鈍" },
  { id: 112, type: 'vocab', wrong: "刻制", correct: "克制" },
  { id: 113, type: 'vocab', wrong: "克薄", correct: "刻薄" },
  { id: 114, type: 'vocab', wrong: "口喝", correct: "口渴" },
  { id: 115, type: 'vocab', wrong: "小氣", correct: "小器" },
  { id: 116, type: 'vocab', wrong: "融恰", correct: "融洽" },
  { id: 117, type: 'vocab', wrong: "慢罵", correct: "謾罵" },
  { id: 118, type: 'vocab', wrong: "賠葬品", correct: "陪葬品" },
  { id: 119, type: 'vocab', wrong: "銷遣", correct: "消遣" },
  { id: 120, type: 'vocab', wrong: "召租", correct: "招租" },
  { id: 121, type: 'vocab', wrong: "煙沒", correct: "湮沒" },
  { id: 122, type: 'vocab', wrong: "破碇", correct: "破綻" },
  { id: 123, type: 'vocab', wrong: "不修編福", correct: "不修邊幅" },
  { id: 124, type: 'vocab', wrong: "坐無虛席", correct: "座無虛席" },
  { id: 125, type: 'vocab', wrong: "草管人命", correct: "草菅人命" },
  { id: 126, type: 'vocab', wrong: "語焉不祥", correct: "語焉不詳" },
  { id: 127, type: 'vocab', wrong: "言重九頂", correct: "言重九鼎" },
  { id: 128, type: 'vocab', wrong: "揮霍無道", correct: "揮霍無度" },
  { id: 129, type: 'vocab', wrong: "孤掌難明", correct: "孤掌難鳴" },
  { id: 130, type: 'vocab', wrong: "養尊處猶", correct: "養尊處優" },
  { id: 131, type: 'vocab', wrong: "豪無二致", correct: "毫無二致" },
  { id: 132, type: 'vocab', wrong: "約定俗承", correct: "約定俗成" },
  { id: 133, type: 'vocab', wrong: "富而不嬌", correct: "富而不驕" },
  { id: 134, type: 'vocab', wrong: "盛宴不在", correct: "盛宴不再" },
  { id: 135, type: 'vocab', wrong: "十面埋服", correct: "十面埋伏" },
  { id: 136, type: 'vocab', wrong: "見逢插針", correct: "見縫插針" },
  { id: 137, type: 'vocab', wrong: "怡笑大方", correct: "貽笑大方" },
  { id: 138, type: 'vocab', wrong: "提壺灌頂", correct: "醍醐灌頂" },
  { id: 139, type: 'vocab', wrong: "步履唯艱", correct: "步履維艱" },
  { id: 140, type: 'vocab', wrong: "對正下藥", correct: "對症下藥" },
  { id: 141, type: 'vocab', wrong: "惡貫滿營", correct: "惡貫滿盈" },
  { id: 142, type: 'vocab', wrong: "相得益張", correct: "相得益彰" },
  { id: 143, type: 'vocab', wrong: "地廣人希", correct: "地廣人稀" },
  { id: 144, type: 'vocab', wrong: "寬弘大量", correct: "寬宏大量" },
  { id: 145, type: 'vocab', wrong: "足志多謀", correct: "足智多謀" },
  { id: 146, type: 'vocab', wrong: "切身處地", correct: "設身處地" },
  { id: 147, type: 'vocab', wrong: "見微知注", correct: "見微知著" },
  { id: 148, type: 'vocab', wrong: "臨喝掘井", correct: "臨渴掘井" },
  { id: 149, type: 'vocab', wrong: "刻不容援", correct: "刻不容緩" },
  { id: 150, type: 'vocab', wrong: "號淘大哭", correct: "號啕大哭" }
];

// Helper to select a random card based on weights
const selectRandomCard = (activeCards, currentCardId) => {
  if (activeCards.length === 0) return null;
  if (activeCards.length === 1) return activeCards[0];

  const totalWeight = activeCards.reduce((sum, card) => sum + card.weight, 0);
  let randomValue = Math.random() * totalWeight;
  
  let selected = activeCards[0];
  for (const card of activeCards) {
    randomValue -= card.weight;
    if (randomValue <= 0) {
      selected = card;
      break;
    }
  }
  
  if (currentCardId && selected.id === currentCardId && activeCards.length > 1) {
     let fallback = activeCards[Math.floor(Math.random() * activeCards.length)];
     let attempts = 0;
     while (fallback.id === currentCardId && attempts < 5) {
       fallback = activeCards[Math.floor(Math.random() * activeCards.length)];
       attempts++;
     }
     selected = fallback;
  }
  return selected;
};

export default function ChineseFlashcards() {
  const [view, setView] = useState('flashcards'); // 'flashcards' | 'saved'
  const [mode, setMode] = useState('vocab'); // 'vocab' | 'sentence'
  const [isReviewingSaved, setIsReviewingSaved] = useState(false);
  const fileInputRef = useRef(null);
  
  // Combine all data for easier state management, filter by 'type' when using
  const allInitialData = [...initialVocabulary];

  const [cards, setCards] = useState(() => {
    try {
      const savedData = localStorage.getItem(STORAGE_KEY);
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        return allInitialData.map(initCard => {
          const savedCard = parsedData.find(sc => sc.id === initCard.id);
          if (savedCard) {
            return {
              ...initCard,
              weight: savedCard.weight,
              sessionCount: savedCard.sessionCount,
              learned: savedCard.learned,
              saved: savedCard.saved
            };
          }
          return { ...initCard, weight: 10, sessionCount: 0, learned: false, saved: false };
        });
      }
    } catch (error) {
      console.error("Failed to load data from storage", error);
    }
    return allInitialData.map(card => ({ 
      ...card, 
      weight: 10, 
      sessionCount: 0, 
      learned: false,
      saved: false 
    }));
  });
  
  const [currentCard, setCurrentCard] = useState(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const [streak, setStreak] = useState(() => {
    try {
      const savedStreak = localStorage.getItem(STREAK_KEY);
      return savedStreak ? parseInt(savedStreak, 10) : 0;
    } catch (e) { return 0; }
  });
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cards));
    localStorage.setItem(STREAK_KEY, streak.toString());
  }, [cards, streak]);

  // Handle Card Selection (Modes + Review Logic)
  useEffect(() => {
    if (!currentCard && !finished) {
      let activeCards = [];
      
      if (isReviewingSaved) {
        // Review Mode: Show ANY saved card, regardless of 'mode' type?
        // Or strictly stick to the current mode tab?
        // Let's stick to current mode tab to avoid confusion (seeing sentences in vocab tab).
        activeCards = cards.filter(c => c.saved && c.type === mode);
      } else {
        // Normal Mode: Show unlearned cards of current mode
        activeCards = cards.filter(c => c.type === mode && !c.learned);
      }

      if (activeCards.length > 0) {
        setCurrentCard(selectRandomCard(activeCards, null));
      } else {
        // Check if finished contextually
        const relevantTotal = isReviewingSaved 
            ? cards.filter(c => c.saved && c.type === mode)
            : cards.filter(c => c.type === mode);
            
        if (relevantTotal.length > 0 && !isReviewingSaved) {
           // Normal mode finished
           setFinished(true);
        } else if (isReviewingSaved && activeCards.length === 0) {
           // Review mode finished (or empty)
           setFinished(true);
        } else {
           // Should not happen, but fallback
           setCurrentCard(null); 
        }
      }
    }
  }, [cards, isReviewingSaved, currentCard, finished, mode]);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleResponse = (knowsIt) => {
    if (!currentCard) return;

    const updatedCards = cards.map(card => {
      if (card.id === currentCard.id) {
        if (knowsIt) {
          if (isReviewingSaved) {
             // In Review Mode, "I Know It" removes it from the saved list
             return { ...card, saved: false };
          } else {
             // Normal Mode: "I Know It" marks as learned
             return { ...card, learned: true, weight: 0 };
          }
        } else {
          // If NOT known (Study Again): Increase weight & Mark as SAVED
          return { 
            ...card, 
            weight: Math.min(100, card.weight + 20), 
            sessionCount: card.sessionCount + 1,
            saved: true 
          };
        }
      }
      return card;
    });

    setCards(updatedCards);

    // Determine next card
    let activeCards = [];
    if (isReviewingSaved) {
        activeCards = updatedCards.filter(c => c.saved && c.type === mode);
    } else {
        activeCards = updatedCards.filter(c => c.type === mode && !c.learned);
    }
    
    if (activeCards.length === 0) {
      setFinished(true);
      setCurrentCard(null);
    } else {
      const nextCard = selectRandomCard(activeCards, currentCard.id);
      setCurrentCard(nextCard);
      setIsFlipped(false);
    }

    if (knowsIt) {
      setStreak(s => s + 1);
    } else {
      setStreak(0);
    }
  };

  const restartSession = () => {
    if (isReviewingSaved) {
       // Just reset UI, logic will pick up remaining saved cards
       setFinished(false);
       setStreak(0);
       const savedCards = cards.filter(c => c.saved && c.type === mode);
       setCurrentCard(selectRandomCard(savedCards, null));
    } else {
       // Reset learned status for current mode
       const resetCards = cards.map(c => {
         if (c.type === mode) {
           return { ...c, learned: false, weight: 10 };
         }
         return c;
       });
       setCards(resetCards);
       setFinished(false);
       setStreak(0);
       const modeCards = resetCards.filter(c => c.type === mode);
       setCurrentCard(selectRandomCard(modeCards, null));
    }
    setIsFlipped(false);
  };

  const startReviewMode = () => {
    // Only start if there are saved cards for CURRENT MODE
    if (cards.filter(c => c.saved && c.type === mode).length === 0) {
        alert(`No saved items for ${mode === 'vocab' ? 'Vocabulary' : 'Sentences'}!`);
        return;
    }
    setIsReviewingSaved(true);
    setView('flashcards');
    setFinished(false);
    setCurrentCard(null);
  };

  const exitReviewMode = () => {
    setIsReviewingSaved(false);
    setView('flashcards');
    setFinished(false);
    setCurrentCard(null);
  };

  const clearStorage = () => {
    if (confirm("Are you sure? This will delete all your progress.")) {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(STREAK_KEY);
      window.location.reload();
    }
  };

  const removeSavedItem = (id) => {
    const updatedCards = cards.map(card => {
      if (card.id === id) return { ...card, saved: false };
      return card;
    });
    setCards(updatedCards);
  };

  const downloadMistakes = () => {
    // Download ALL mistakes or just current mode? Let's download ALL to be safe.
    const savedList = cards.filter(c => c.saved);
    if (savedList.length === 0) return;
    const fileContent = savedList.map(card => `${card.wrong} ${card.correct}`).join('\n');
    const element = document.createElement("a");
    const file = new Blob([fileContent], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = "mistakes.txt";
    document.body.appendChild(element); 
    element.click();
    document.body.removeChild(element);
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target.result;
      const lines = content.split(/\r?\n/);
      const updatedCards = [...cards];
      let importCount = 0;

      lines.forEach(line => {
        if (!line.trim()) return;
        const parts = line.trim().split(' ');
        if (parts.length >= 2) {
            const wrongText = parts[0];
            const cardIndex = updatedCards.findIndex(c => c.wrong === wrongText);
            if (cardIndex !== -1) {
                updatedCards[cardIndex] = { ...updatedCards[cardIndex], saved: true };
                importCount++;
            }
        }
      });

      setCards(updatedCards);
      alert(`Imported ${importCount} words to your Review List.`);
      event.target.value = '';
    };
    reader.readAsText(file);
  };

  const activeCount = isReviewingSaved 
    ? cards.filter(c => c.saved && c.type === mode).length 
    : cards.filter(c => c.type === mode && !c.learned).length;
    
  // Show ALL saved items in the list view, or filter by mode?
  // Let's filter by mode to keep the list relevant to the current context
  const savedList = cards.filter(c => c.saved && c.type === mode);

  // --- RENDER SAVED LIST ---
  if (view === 'saved') {
    return (
      <div className="min-h-screen bg-amber-50 flex flex-col items-center py-6 px-4 font-sans text-stone-800 pb-24">
        {/* Top Tabs */}

        <header className="w-full max-w-md flex flex-col gap-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
                <Bookmark className="w-6 h-6 text-red-600" />
                <h1 className="text-2xl font-bold text-stone-800">Review List</h1>
            </div>
            <button onClick={clearStorage} className="flex items-center gap-2 bg-stone-200 text-stone-600 px-3 py-2 rounded-lg text-xs font-bold hover:bg-stone-300 transition-colors"><Trash2 className="w-4 h-4" /></button>
          </div>

          <div className="flex gap-2 w-full">
             <button onClick={startReviewMode} disabled={savedList.length === 0} className="flex-1 flex items-center justify-center gap-2 bg-red-600 text-white px-4 py-3 rounded-xl text-sm font-bold hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm transition-all active:scale-95">
                <Play className="w-4 h-4 fill-current" /> Review Mistakes
            </button>
          </div>

          <div className="flex gap-2 w-full">
            <button onClick={downloadMistakes} disabled={savedList.length === 0} className="flex-1 flex items-center justify-center gap-2 bg-stone-800 text-white px-3 py-2 rounded-lg text-xs font-bold hover:bg-stone-700 disabled:opacity-50 transition-colors"><Download className="w-4 h-4" /> Download</button>
            <button onClick={triggerFileInput} className="flex-1 flex items-center justify-center gap-2 bg-stone-800 text-white px-3 py-2 rounded-lg text-xs font-bold hover:bg-stone-700 transition-colors"><Upload className="w-4 h-4" /> Import .txt</button>
            <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept=".txt" className="hidden" />
          </div>
        </header>

        <div className="w-full max-w-md space-y-3">
          {savedList.length === 0 ? (
            <div className="text-center py-10 text-stone-400">
              <p>No saved items for {mode === 'vocab' ? 'Vocabulary' : 'Sentences'}.</p>
              <p className="text-sm mt-2">Click "Study Again" on a card to add it here.</p>
            </div>
          ) : (
            savedList.map((card) => (
              <div key={card.id} className="relative bg-white p-4 rounded-xl shadow-sm border border-stone-100 flex flex-col gap-2 group">
                <div className="flex items-start justify-between">
                   <div className="w-full pr-6">
                      <span className="text-xs text-stone-400 uppercase tracking-widest mb-1 block">Wrong</span>
                      <span className={`${card.type === 'sentence' ? 'text-lg leading-relaxed' : 'text-xl'} font-medium text-stone-500 line-through decoration-red-300 block`}>{card.wrong}</span>
                   </div>
                </div>
                <div className="w-full border-t border-stone-100 pt-2">
                    <span className="text-xs text-green-600 uppercase tracking-widest mb-1 block font-bold">Correct</span>
                    <span className={`${card.type === 'sentence' ? 'text-lg leading-relaxed' : 'text-2xl'} font-bold text-stone-800 block`}>{card.correct}</span>
                    {card.note && <p className="text-xs text-stone-400 mt-1 italic">{card.note}</p>}
                </div>
                <button onClick={() => removeSavedItem(card.id)} className="absolute top-2 right-2 bg-stone-200 hover:bg-red-500 hover:text-white text-stone-500 p-1 rounded-full shadow-sm transition-colors opacity-100 md:opacity-0 md:group-hover:opacity-100"><X className="w-4 h-4" /></button>
              </div>
            ))
          )}
        </div>

        {/* Bottom Nav */}
        <div className="fixed bottom-0 left-0 w-full bg-white border-t border-stone-200 p-3 flex justify-center gap-8 z-10">
          <button onClick={() => setView('flashcards')} className={`flex flex-col items-center gap-1 ${view === 'flashcards' ? 'text-red-600' : 'text-stone-400'}`}><Layers className="w-6 h-6" /><span className="text-xs font-medium">Flashcards</span></button>
          <button onClick={() => setView('saved')} className={`flex flex-col items-center gap-1 ${view === 'saved' ? 'text-red-600' : 'text-stone-400'}`}><List className="w-6 h-6" /><span className="text-xs font-medium">Review List</span>{savedList.length > 0 && <span className="absolute ml-6 mb-4 w-2 h-2 bg-red-500 rounded-full"></span>}</button>
        </div>
      </div>
    );
  }

  // --- RENDER FLASHCARDS ---
  return (
    <div className={`min-h-screen flex flex-col items-center py-6 px-4 font-sans text-stone-800 pb-24 ${isReviewingSaved ? 'bg-red-50' : 'bg-amber-50'}`}>
      
      {/* Top Tabs for Mode Switching */}

      {/* Header */}
      <header className="w-full max-w-md flex justify-between items-center mb-6">
        <div className="flex items-center gap-2 text-stone-800">
          {mode === 'vocab' ? <BookOpen className={`w-6 h-6 ${isReviewingSaved ? 'text-stone-800' : 'text-red-600'}`} /> : <PenTool className={`w-6 h-6 ${isReviewingSaved ? 'text-stone-800' : 'text-red-600'}`} />}
          <span className="text-xl font-bold">
            {isReviewingSaved ? "Reviewing Mistakes" : (mode === 'vocab' ? 'Vocabulary' : 'Sentences')}
          </span>
        </div>
        <div className="flex items-center gap-2">
            <div className="text-sm font-semibold text-stone-500 mr-2">剩餘: {activeCount}</div>
            {isReviewingSaved ? (
                <button onClick={exitReviewMode} className="bg-stone-200 px-3 py-1 rounded-full text-xs font-bold hover:bg-stone-300">Exit</button>
            ) : (
                <div className="flex items-center gap-2 bg-white px-3 py-1 rounded-full shadow-sm text-sm font-medium text-stone-600">
                <BarChart2 className="w-4 h-4 text-orange-500" /><span>{streak}</span>
                </div>
            )}
        </div>
      </header>

      {/* Completion State */}
      {finished ? (
         <div className="flex-1 flex flex-col items-center justify-center text-center w-full max-w-md">
            <div className="bg-white p-10 rounded-3xl shadow-xl w-full border border-amber-100">
              <Trophy className="w-20 h-20 text-yellow-500 mb-6 mx-auto" />
              <h2 className="text-3xl font-bold text-stone-800 mb-2">恭喜 (Gōngxǐ)!</h2>
              <p className="text-stone-500 mb-8">
                  {isReviewingSaved ? "You've cleared your review list for this section!" : "You've completed all cards in this section."}
              </p>
              <button onClick={restartSession} className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-full flex items-center justify-center gap-2 w-full transition-transform active:scale-95"><RefreshCw className="w-5 h-5" /> Start Over</button>
            </div>
         </div>
      ) : currentCard ? (
        <>
          {/* Progress Bar */}
          <div className="w-full max-w-md bg-stone-200 h-2 rounded-full mb-8 overflow-hidden">
            <div className={`${isReviewingSaved ? 'bg-red-500' : 'bg-green-500'} h-full transition-all duration-500`} style={{ width: `${((isReviewingSaved ? savedList.length : cards.filter(c => c.type === mode).length) - activeCount) / (isReviewingSaved ? savedList.length : cards.filter(c => c.type === mode).length) * 100}%` }} />
          </div>

          {/* Card Area */}
          <div className="perspective-1000 w-full max-w-md h-96 cursor-pointer group" onClick={handleFlip}>
            <div className={`relative w-full h-full transition-transform duration-500 transform-style-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
              
              {/* Front (WRONG) */}
              <div className="absolute w-full h-full backface-hidden bg-white rounded-3xl shadow-xl flex flex-col items-center justify-center border-2 border-stone-100 p-8 hover:shadow-2xl transition-shadow overflow-hidden">
                <div className="absolute top-6 right-6 flex items-center gap-1 text-red-400 bg-red-50 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
                    <AlertTriangle className="w-3 h-3" /><span>Incorrect</span>
                </div>
                <div className="text-center w-full">
                    <span className="text-sm text-stone-400 font-semibold tracking-widest uppercase mb-4 block">Identify the Error</span>
                    <h2 className={`${currentCard.wrong.length > 20 ? 'text-xl text-left leading-relaxed' : currentCard.wrong.length > 5 ? 'text-3xl' : 'text-6xl'} font-bold text-stone-800 mb-2`}>
                    {currentCard.wrong}
                    </h2>
                </div>
                <p className="text-stone-300 text-sm mt-12 animate-pulse absolute bottom-8">Tap to flip</p>
              </div>

              {/* Back (CORRECT) */}
              <div className="absolute w-full h-full backface-hidden bg-red-600 rounded-3xl shadow-xl rotate-y-180 flex flex-col items-center justify-center p-8 text-white">
                 <div className="absolute top-6 right-6 flex items-center gap-1 text-red-600 bg-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
                    <Check className="w-3 h-3" /><span>Correct</span>
                </div>
                 <div className="flex flex-col items-center text-center space-y-4 w-full h-full justify-center">
                  <div className="w-full">
                    <span className="text-xs text-red-200 uppercase tracking-widest opacity-80 block mb-1">You saw</span>
                    <p className={`${currentCard.wrong.length > 20 ? 'text-sm text-left' : 'text-xl'} font-medium text-red-200 line-through decoration-red-300/50`}>{currentCard.wrong}</p>
                  </div>
                  <div className="w-16 h-1 bg-red-400 rounded-full shrink-0"></div>
                  <div className="w-full">
                    <span className="text-xs text-red-200 uppercase tracking-widest opacity-80 block mb-1">Correct Form</span>
                    <p className={`${currentCard.correct.length > 20 ? 'text-lg text-left leading-relaxed' : currentCard.correct.length > 4 ? 'text-4xl' : 'text-6xl'} font-bold tracking-wide`}>{currentCard.correct}</p>
                  </div>
                  {currentCard.note && (
                    <div className="mt-2 bg-red-800/30 p-3 rounded-lg w-full text-left border border-red-500/30">
                        <span className="text-xs text-red-200 font-bold uppercase">Note:</span>
                        <p className="text-sm text-red-100">{currentCard.note}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex gap-4 mt-8 w-full max-w-md">
            <button onClick={(e) => { e.stopPropagation(); handleResponse(false); }} className="flex-1 bg-red-100 hover:bg-red-200 text-red-700 font-bold py-4 px-6 rounded-2xl transition-colors flex flex-col items-center gap-1 border-2 border-red-200 hover:border-red-300 active:scale-95 transform"><X className="w-6 h-6" /><span className="text-sm">Study Again</span></button>
            <button onClick={(e) => { e.stopPropagation(); handleResponse(true); }} className="flex-1 bg-green-100 hover:bg-green-200 text-green-700 font-bold py-4 px-6 rounded-2xl transition-colors flex flex-col items-center gap-1 border-2 border-green-200 hover:border-green-300 active:scale-95 transform"><Check className="w-6 h-6" /><span className="text-sm">I Know It</span></button>
          </div>
        </>
      ) : <div className="text-stone-500 mt-20">Loading...</div>}

      {/* Bottom Nav */}
      <div className="fixed bottom-0 left-0 w-full bg-white border-t border-stone-200 p-3 flex justify-center gap-8 z-10">
        <button onClick={() => { setView('flashcards'); setIsReviewingSaved(false); }} className={`flex flex-col items-center gap-1 ${view === 'flashcards' ? 'text-red-600' : 'text-stone-400'}`}><Layers className="w-6 h-6" /><span className="text-xs font-medium">Flashcards</span></button>
        <button onClick={() => setView('saved')} className={`flex flex-col items-center gap-1 ${view === 'saved' ? 'text-red-600' : 'text-stone-400'}`}><List className="w-6 h-6" /><span className="text-xs font-medium">Review List</span>{savedList.length > 0 && <span className="absolute ml-6 mb-4 w-2 h-2 bg-red-500 rounded-full"></span>}</button>
      </div>

      <style jsx global>{`
        .perspective-1000 { perspective: 1000px; }
        .transform-style-3d { transform-style: preserve-3d; }
        .backface-hidden { backface-visibility: hidden; }
        .rotate-y-180 { transform: rotateY(180deg); }
      `}</style>
    </div>
  );
}