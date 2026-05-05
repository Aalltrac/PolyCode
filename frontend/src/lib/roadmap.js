export const CATEGORIES = [
  { id: "fondamentaux", label: "Fondamentaux" },
  { id: "intermediaire", label: "Intermédiaire" },
  { id: "avance", label: "Avancé" },
  { id: "specialise", label: "Spécialisé" },
  { id: "niche", label: "Niche / Académique" },
  { id: "historique", label: "Historique / Rare" },
];

export const ROADMAP = [
  { id: "python", rank: 1, title: "Python", description: "Syntaxe lisible, polyvalent. Idéal pour débuter.", category: "fondamentaux" },
  { id: "javascript", rank: 2, title: "JavaScript", description: "Language du web, incontournable côté client.", category: "fondamentaux" },
  { id: "html-css", rank: 3, title: "HTML/CSS", description: "Bases du web. Pas des langages de prog. mais essentiels.", category: "fondamentaux" },
  { id: "scratch", rank: 4, title: "Scratch", description: "Programmation visuelle pour débutants absolus.", category: "fondamentaux" },
  { id: "blockly", rank: 5, title: "Blockly", description: "Programmation par blocs visuels (Google).", category: "fondamentaux" },
  { id: "java", rank: 6, title: "Java", description: "Orienté objet, très enseigné en école.", category: "fondamentaux" },
  { id: "c", rank: 7, title: "C", description: "Fondations de l'informatique, gestion mémoire.", category: "fondamentaux" },

  { id: "cpp", rank: 8, title: "C++", description: "Extension de C, orienté objet, très performant.", category: "intermediaire" },
  { id: "csharp", rank: 9, title: "C#", description: "Écosystème Microsoft, .NET, Unity (jeux vidéo).", category: "intermediaire" },
  { id: "typescript", rank: 10, title: "TypeScript", description: "Surcouche typée de JavaScript.", category: "intermediaire" },
  { id: "php", rank: 11, title: "PHP", description: "Backend web, WordPress, Laravel.", category: "intermediaire" },
  { id: "ruby", rank: 12, title: "Ruby", description: "Élégant, Rails pour le web.", category: "intermediaire" },
  { id: "swift", rank: 13, title: "Swift", description: "Développement iOS / macOS (Apple).", category: "intermediaire" },
  { id: "kotlin", rank: 14, title: "Kotlin", description: "Android moderne, interop Java.", category: "intermediaire" },
  { id: "go", rank: 15, title: "Go", description: "Concurrent, performant, cloud-native.", category: "intermediaire" },

  { id: "rust", rank: 16, title: "Rust", description: "Sécurité mémoire sans GC, très performant.", category: "avance" },
  { id: "scala", rank: 17, title: "Scala", description: "JVM, fonctionnel + objet, Big Data (Spark).", category: "avance" },
  { id: "haskell", rank: 18, title: "Haskell", description: "Purement fonctionnel, paradigme fort.", category: "avance" },
  { id: "elixir", rank: 19, title: "Elixir", description: "Erlang VM, systèmes distribués, haute dispo.", category: "avance" },
  { id: "erlang", rank: 20, title: "Erlang", description: "Concurrence massive, télécom.", category: "avance" },
  { id: "clojure", rank: 21, title: "Clojure", description: "Lisp sur JVM, fonctionnel.", category: "avance" },
  { id: "fsharp", rank: 22, title: "F#", description: "Fonctionnel .NET, finance, science.", category: "avance" },
  { id: "ocaml", rank: 23, title: "OCaml", description: "Fonctionnel, inférence de types, vérification formelle.", category: "avance" },

  { id: "julia", rank: 24, title: "Julia", description: "Calcul scientifique haute performance.", category: "specialise" },
  { id: "r", rank: 25, title: "R", description: "Statistiques, data science, visualisation.", category: "specialise" },
  { id: "matlab", rank: 26, title: "MATLAB", description: "Calcul numérique, ingénierie, signal.", category: "specialise" },
  { id: "sql", rank: 27, title: "SQL", description: "Requêtes de bases de données relationnelles.", category: "specialise" },
  { id: "bash", rank: 28, title: "Bash / Shell", description: "Scripting système Unix/Linux.", category: "specialise" },
  { id: "powershell", rank: 29, title: "PowerShell", description: "Scripting Windows, automatisation.", category: "specialise" },
  { id: "lua", rank: 30, title: "Lua", description: "Embarqué dans jeux (Roblox, WoW) et logiciels.", category: "specialise" },
  { id: "dart", rank: 31, title: "Dart", description: "Flutter, apps mobiles cross-platform.", category: "specialise" },
  { id: "solidity", rank: 32, title: "Solidity", description: "Smart contracts Ethereum / blockchain.", category: "specialise" },
  { id: "vhdl", rank: 33, title: "VHDL", description: "Description matérielle (FPGA, circuits).", category: "specialise" },
  { id: "verilog", rank: 34, title: "Verilog", description: "Description matérielle, simulation circuits.", category: "specialise" },
  { id: "assembly", rank: 35, title: "Assembly (x86/ARM)", description: "Langage machine, proche du CPU.", category: "specialise" },
  { id: "objective-c", rank: 36, title: "Objective-C", description: "Ancêtre de Swift, héritage iOS/macOS.", category: "specialise" },
  { id: "perl", rank: 37, title: "Perl", description: "Traitement texte, bioinformatique.", category: "specialise" },
  { id: "zig", rank: 38, title: "Zig", description: "Successeur de C, systèmes bas niveau.", category: "specialise" },

  { id: "nim", rank: 39, title: "Nim", description: "Syntaxe Python, performance C.", category: "niche" },
  { id: "crystal", rank: 40, title: "Crystal", description: "Syntaxe Ruby, compilé, performant.", category: "niche" },
  { id: "d", rank: 41, title: "D", description: "C++ moderne, systèmes.", category: "niche" },
  { id: "prolog", rank: 42, title: "Prolog", description: "Logique déclarative, IA symbolique.", category: "niche" },
  { id: "racket", rank: 43, title: "Racket", description: "Scheme/Lisp éducatif et recherche.", category: "niche" },
  { id: "scheme", rank: 44, title: "Scheme", description: "Lisp minimaliste, enseignement.", category: "niche" },
  { id: "common-lisp", rank: 45, title: "Common Lisp", description: "Lisp historique, IA, macros puissantes.", category: "niche" },
  { id: "ada", rank: 46, title: "Ada", description: "Critique, aérospatial, sûreté.", category: "niche" },
  { id: "smalltalk", rank: 47, title: "Smalltalk", description: "Orienté objet pur, berceau des IDE.", category: "niche" },
  { id: "eiffel", rank: 48, title: "Eiffel", description: "Design by contract, génie logiciel.", category: "niche" },
  { id: "mercury", rank: 49, title: "Mercury", description: "Logique + fonctionnel, typage strict.", category: "niche" },
  { id: "idris", rank: 50, title: "Idris", description: "Types dépendants, preuves formelles.", category: "niche" },
  { id: "agda", rank: 51, title: "Agda", description: "Assistant de preuves, théorie des types.", category: "niche" },
  { id: "coq", rank: 52, title: "Coq", description: "Vérification formelle, mathématiques.", category: "niche" },
  { id: "lean", rank: 53, title: "Lean", description: "Prouveur de théorèmes, mathématiques formelles.", category: "niche" },

  { id: "forth", rank: 54, title: "Forth", description: "Stack-based, embarqué, astronautique.", category: "historique" },
  { id: "apl", rank: 55, title: "APL", description: "Tableaux, notation symbolique dense.", category: "historique" },
  { id: "cobol", rank: 56, title: "COBOL", description: "Finance, banques, legacy mainframe.", category: "historique" },
  { id: "fortran", rank: 57, title: "Fortran", description: "Calcul scientifique historique, HPC.", category: "historique" },
  { id: "pascal", rank: 58, title: "Pascal", description: "Enseignement historique, Delphi.", category: "historique" },
  { id: "basic", rank: 59, title: "BASIC", description: "Initiation historique aux débuts du PC.", category: "historique" },
  { id: "algol", rank: 60, title: "ALGOL", description: "Ancêtre de C, fondateur de la syntaxe moderne.", category: "historique" },
  { id: "pl1", rank: 61, title: "PL/I", description: "IBM mainframe, usage industriel.", category: "historique" },
  { id: "rpg", rank: 62, title: "RPG", description: "IBM AS/400, ERP legacy.", category: "historique" },
  { id: "rexx", rank: 63, title: "Rexx", description: "Scripting IBM mainframe.", category: "historique" },
  { id: "abap", rank: 64, title: "ABAP", description: "SAP ERP, développement entreprise.", category: "historique" },
  { id: "tcl", rank: 65, title: "Tcl", description: "Scripting embarqué, EDA (circuits).", category: "historique" },
  { id: "snobol", rank: 66, title: "SNOBOL", description: "Traitement de chaînes, historique.", category: "historique" },
  { id: "simula", rank: 67, title: "Simula", description: "Premier langage OO, ancêtre de C++.", category: "historique" },
  { id: "lisp", rank: 68, title: "LISP (1958)", description: "Le plus ancien encore actif, IA historique.", category: "historique" },
  { id: "brainfuck", rank: 69, title: "Brainfuck", description: "Ésotérique, défi intellectuel.", category: "historique" },
  { id: "whitespace", rank: 70, title: "Whitespace", description: "Langage ésotérique basé sur espaces.", category: "historique" },
];

export function getCourseById(id) {
  return ROADMAP.find((c) => c.id === id);
}

export function groupByCategory() {
  const groups = {};
  CATEGORIES.forEach((cat) => {
    groups[cat.id] = { ...cat, courses: [] };
  });
  ROADMAP.forEach((course) => {
    if (groups[course.category]) groups[course.category].courses.push(course);
  });
  return groups;
}
