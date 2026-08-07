/*
 * RAMQ Radar — données officielles de référence
 * Source : Tableaux-synthèses des codes de facturation et des tarifs de
 * l'onglet B — Consultation, examen et visite (RAMQ, 6 août 2026).
 *
 * Chaque tarif contextuel est conservé comme une ligne distincte afin que
 * l'application actuelle puisse filtrer, rechercher, importer et exporter
 * les données sans perdre la condition de lieu ou de clientèle.
 */

const RAMQ_DATA_META = Object.freeze({
  version: "2026-08-06",
  updatedLabel: "6 août 2026",
  scope: "Onglet B — consultation, examen et visite",
  sourceUrl: "https://www.ramq.gouv.qc.ca/fr/professionnels/media/32176",
  pdfUrl: "https://www.ramq.gouv.qc.ca/sites/default/files/documents/non_indexes/tableaux_onglet_b_hyperliens_2026-08.pdf"
});

const DEFAULT_CODES = (() => {
  const codes = [];

  const add = ({code, description, category, tariff, practiceTypes, page, context, duration = 0, tags = []}) => {
    codes.push({
      id: `${code}-${String(codes.length + 1).padStart(3, "0")}`,
      code,
      description,
      category,
      tags: Array.from(new Set(tags)),
      tariff,
      duration_min: duration,
      practiceTypes,
      context,
      source_page: page,
      data_version: RAMQ_DATA_META.version
    });
  };

  const addRows = ({category, practiceTypes, page, context, tags = [], rows}) => {
    rows.forEach(([code, description, tariff, duration = 0, rowTags = [], rowContext = ""]) => add({
      code,
      description,
      category,
      tariff,
      duration,
      practiceTypes,
      page,
      context: rowContext || context,
      tags: [...tags, ...rowTags]
    }));
  };

  const addCabinetClscRows = ({category, page, tags = [], extraPracticeTypes = [], rows}) => {
    rows.forEach(([code, description, cabinetTariff, clscTariff, duration = 0, rowTags = []]) => {
      add({
        code,
        description,
        category,
        tariff: cabinetTariff,
        duration,
        practiceTypes: ["Cabinet", "GMF", "Domicile", ...extraPracticeTypes],
        page,
        context: "Cabinet/GMF, ou domicile lié aux activités du médecin en cabinet",
        tags: [...tags, ...rowTags, "cabinet"]
      });
      add({
        code,
        description,
        category,
        tariff: clscTariff,
        duration,
        practiceTypes: ["CLSC", "GMF-U", "Domicile", ...extraPracticeTypes],
        page,
        context: "CLSC/GMF-U, ou domicile lié aux activités du médecin en CLSC/GMF-U",
        tags: [...tags, ...rowTags, "clsc", "gmf-u"]
      });
    });
  };

  /* Page 1 — examens d'un patient inscrit */
  addRows({
    category: "Examen — préanesthésie",
    practiceTypes: ["Tout lieu"],
    page: 1,
    context: "Tout lieu autorisé",
    tags: ["examen", "préopératoire", "anesthésie"],
    rows: [
      ["09092", "Examen de préanesthésie — patient de 0 à 69 ans", 28.10],
      ["09093", "Examen de préanesthésie — patient de 70 ans ou plus", 28.15],
      ["15192", "Examen de préanesthésie d'urgence avec déplacement — patient de 0 à 69 ans", 75.45],
      ["15193", "Examen de préanesthésie d'urgence avec déplacement — patient de 70 ans ou plus", 80.60]
    ]
  });

  addRows({
    category: "Supplément",
    practiceTypes: ["Cabinet", "GMF"],
    page: 1,
    context: "Cabinet",
    tags: ["supplément", "responsabilité", "grossesse"],
    rows: [
      ["08877", "Supplément de responsabilité à l'examen", 17.05],
      ["15144", "Supplément de responsabilité pour suivi de grossesse", 11.40],
      ["15159", "Supplément à l'examen de prise en charge de grossesse", 47.40]
    ]
  });
  addRows({
    category: "Supplément",
    practiceTypes: ["CLSC", "GMF-U"],
    page: 1,
    context: "CLSC ou GMF-U en établissement, lorsque permis",
    tags: ["supplément", "responsabilité", "grossesse"],
    rows: [
      ["08877", "Supplément de responsabilité à l'examen", 13.35],
      ["15145", "Supplément de responsabilité pour suivi de grossesse", 8.95],
      ["15159", "Supplément à l'examen de prise en charge de grossesse", 35.60]
    ]
  });
  addRows({
    category: "Supplément",
    practiceTypes: ["Clinique externe"],
    page: 1,
    context: "Clinique externe, lorsque permis",
    tags: ["supplément", "grossesse"],
    rows: [
      ["15145", "Supplément de responsabilité pour suivi de grossesse", 8.95],
      ["15159", "Supplément à l'examen de prise en charge de grossesse", 35.60]
    ]
  });
  addRows({
    category: "Examen — grossesse",
    practiceTypes: ["Tout lieu"],
    page: 1,
    context: "Lieu autorisé selon l'onglet B",
    tags: ["examen", "grossesse", "prise en charge"],
    rows: [["00059", "Examen de prise en charge de grossesse", 66.70]]
  });
  addRows({
    category: "Supplément",
    practiceTypes: ["Urgence"],
    page: 1,
    context: "Clinique d'urgence d'un CHSGS uniquement",
    tags: ["supplément", "urgence", "patient admis", "garde"],
    rows: [["15637", "Supplément à l'examen ou à l'intervention pour un patient admis par le médecin de garde", 7.40]]
  });

  addRows({
    category: "Examen ordinaire",
    practiceTypes: ["Urgence", "CLSC réseau de garde"],
    page: 1,
    context: "Clinique d'urgence CHSGS ou CLSC du réseau de garde",
    tags: ["examen", "ordinaire", "patient inscrit"],
    rows: [
      ["15052", "Examen ordinaire sans déplacement — patient de 0 à 69 ans", 17.60],
      ["15053", "Examen ordinaire sans déplacement — patient de 70 à 79 ans", 22.65],
      ["15054", "Examen ordinaire sans déplacement — patient de 80 ans ou plus", 23.70],
      ["15055", "Examen ordinaire d'urgence avec déplacement — patient de 0 à 69 ans", 77.60],
      ["15056", "Examen ordinaire d'urgence avec déplacement — patient de 70 à 79 ans", 96.35],
      ["15057", "Examen ordinaire d'urgence avec déplacement — patient de 80 ans ou plus", 100.45]
    ]
  });
  addRows({
    category: "Examen ordinaire",
    practiceTypes: ["Clinique externe"],
    page: 1,
    context: "Clinique externe d'un CHSGS",
    tags: ["examen", "ordinaire", "patient inscrit"],
    rows: [
      ["00005", "Examen ordinaire sans déplacement — patient de 0 à 69 ans", 14.55],
      ["08882", "Examen ordinaire sans déplacement — patient de 70 à 79 ans", 17.70],
      ["08883", "Examen ordinaire sans déplacement — patient de 80 ans ou plus", 18.50],
      ["00006", "Examen ordinaire d'urgence avec déplacement — patient de 0 à 69 ans", 73.80],
      ["08884", "Examen ordinaire d'urgence avec déplacement — patient de 70 à 79 ans", 85.75],
      ["08885", "Examen ordinaire d'urgence avec déplacement — patient de 80 ans ou plus", 89.60]
    ]
  });
  addRows({
    category: "Examen principal",
    practiceTypes: ["Établissement", "Urgence"],
    page: 1,
    context: "Lieu autorisé selon l'onglet B",
    tags: ["examen", "principal", "patient inscrit"],
    rows: [
      ["15058", "Examen principal sans déplacement — patient de 0 à 69 ans", 35.05],
      ["15059", "Examen principal sans déplacement — patient de 70 à 79 ans", 56.15],
      ["15060", "Examen principal sans déplacement — patient de 80 ans ou plus", 58.70],
      ["15061", "Examen principal d'urgence avec déplacement — patient de 0 à 69 ans", 77.60],
      ["15062", "Examen principal d'urgence avec déplacement — patient de 70 à 79 ans", 96.35],
      ["15063", "Examen principal d'urgence avec déplacement — patient de 80 ans ou plus", 100.45]
    ]
  });

  /* Page 2 — examens complet, complet majeur et situation complexe */
  addRows({
    category: "Examen complet",
    practiceTypes: ["Urgence", "CLSC réseau de garde", "Clinique externe"],
    page: 2,
    context: "Clinique d'urgence, CLSC du réseau de garde ou clinique externe selon les conditions RAMQ",
    tags: ["examen", "complet", "patient inscrit"],
    rows: [
      ["00056", "Examen complet sans déplacement — patient de 0 à 69 ans", 30.65],
      ["09116", "Examen complet sans déplacement — patient de 70 ans ou plus", 32.45],
      ["00057", "Examen complet d'urgence avec déplacement — patient de 0 à 69 ans", 73.80],
      ["09117", "Examen complet d'urgence avec déplacement — patient de 70 ans ou plus", 85.75]
    ]
  });
  addRows({
    category: "Examen complet majeur",
    practiceTypes: ["Urgence", "CLSC réseau de garde", "Clinique externe"],
    page: 2,
    context: "Clinique d'urgence, CLSC du réseau de garde ou clinique externe selon les conditions RAMQ",
    tags: ["examen", "complet", "majeur", "patient inscrit"],
    rows: [
      ["00097", "Examen complet majeur sans déplacement — patient de 0 à 69 ans", 55.55],
      ["09119", "Examen complet majeur sans déplacement — patient de 70 ans ou plus", 59.35],
      ["00098", "Examen complet majeur d'urgence avec déplacement — patient de 0 à 69 ans", 73.80],
      ["09120", "Examen complet majeur d'urgence avec déplacement — patient de 70 ans ou plus", 85.75]
    ]
  });
  addRows({
    category: "Intervention complexe",
    practiceTypes: ["Établissement"],
    page: 2,
    context: "Situation complexe — modalités et maxima du manuel applicables",
    tags: ["intervention", "complexe", "temps"],
    rows: [
      ["15064", "Intervention en situation complexe — première période, patient de 0 à 69 ans", 112.95, 30],
      ["15064", "Intervention en situation complexe — période supplémentaire (maximum 4), patient de 0 à 69 ans", 28.55, 15],
      ["15068", "Intervention en situation complexe — première période, patient de 70 ans ou plus", 112.95, 30],
      ["15068", "Intervention en situation complexe — période supplémentaire (maximum 5), patient de 70 ans ou plus", 28.55, 15]
    ]
  });

  /* Pages 3 et 4 — patient admis */
  addRows({
    category: "Patient admis — visite",
    practiceTypes: ["CHSGS"],
    page: 3,
    context: "CHSGS — niveau A",
    tags: ["patient admis", "visite", "hôpital"],
    rows: [
      ["15158", "Forfait de congé en établissement", 35.55],
      ["15638", "Visite de prise en charge", 87.20],
      ["15639", "Première visite de suivi", 57.25],
      ["15640", "Visite de suivi subséquente", 29.45],
      ["15641", "Visite de transfert", 72.45],
      ["15642", "Visite d'évaluation ou d'opinion", 87.20]
    ]
  });
  addRows({
    category: "Patient admis — visite",
    practiceTypes: ["CHSGS"],
    page: 3,
    context: "CHSGS — niveau B",
    tags: ["patient admis", "visite", "hôpital"],
    rows: [
      ["15158", "Forfait de congé en établissement", 35.55],
      ["15647", "Visite de prise en charge", 100.90],
      ["15648", "Première visite de suivi", 66.20],
      ["15649", "Visite de suivi subséquente", 34.00],
      ["15650", "Visite de transfert", 83.80],
      ["15651", "Visite d'évaluation ou d'opinion", 100.90]
    ]
  });
  addRows({
    category: "Patient admis — visite",
    practiceTypes: ["Psychiatrie", "CHSP"],
    page: 3,
    context: "Unité ou programme désigné de gérontopsychiatrie",
    tags: ["patient admis", "visite", "gérontopsychiatrie"],
    rows: [
      ["15667", "Visite de prise en charge en gérontopsychiatrie", 168.20],
      ["15668", "Visite d'évaluation ou d'opinion en gérontopsychiatrie", 168.20]
    ]
  });
  addRows({
    category: "Patient admis — visite",
    practiceTypes: ["CHSLD", "CHSP"],
    page: 3,
    context: "CHSLD ou CHSP — longue durée",
    tags: ["patient admis", "visite", "longue durée"],
    rows: [
      ["15616", "Visite de suivi courant", 21.70],
      ["15617", "Visite de suivi exigeant un examen", 43.40],
      ["15619", "Visite d'évaluation ou d'opinion", 85.15],
      ["15615", "Évaluation médicale globale", 86.90]
    ]
  });
  addRows({
    category: "Patient admis — visite",
    practiceTypes: ["Centre de réadaptation"],
    page: 3,
    context: "Centre de réadaptation ou installation de traitement des dépendances",
    tags: ["patient admis", "visite", "réadaptation"],
    rows: [
      ["15626", "Visite de prise en charge", 84.30],
      ["15627", "Visite de suivi courant", 21.70],
      ["15628", "Visite de suivi exigeant un examen", 43.40],
      ["15629", "Visite de transfert", 55.25],
      ["15630", "Visite d'évaluation ou d'opinion", 84.30]
    ]
  });

  addRows({
    category: "Patient admis — échange",
    practiceTypes: ["CHSLD", "CHSP"],
    page: 4,
    context: "CHSLD ou CHSP — longue durée",
    tags: ["patient admis", "échange", "interdisciplinaire"],
    rows: [
      ["15618", "Rédaction du formulaire de niveau d'intervention médicale (NIM)", 24.87],
      ["15620", "Échange interdisciplinaire ou avec les proches", 24.87, 15],
      ["15621", "Échange concernant l'ensemble des patients d'une unité ou d'un établissement", 24.87, 15],
      ["15622", "Réponse téléphonique", 16.55]
    ]
  });
  addRows({
    category: "Patient admis — échange",
    practiceTypes: ["CHSGS"],
    page: 4,
    context: "CHSGS — niveau A",
    tags: ["patient admis", "échange", "interdisciplinaire"],
    rows: [["15643", "Échange interdisciplinaire ou avec les proches", 24.87, 15]]
  });
  addRows({
    category: "Patient admis — échange",
    practiceTypes: ["CHSGS"],
    page: 4,
    context: "CHSGS — niveau B",
    tags: ["patient admis", "échange", "interdisciplinaire"],
    rows: [["15652", "Échange interdisciplinaire ou avec les proches", 24.87, 15]]
  });
  addRows({
    category: "Patient admis — échange",
    practiceTypes: ["Centre de réadaptation"],
    page: 4,
    context: "Centre de réadaptation ou installation de traitement des dépendances",
    tags: ["patient admis", "échange", "interdisciplinaire"],
    rows: [
      ["15631", "Échange interdisciplinaire ou avec les proches", 24.87, 15],
      ["15632", "Échange concernant l'ensemble des patients d'une unité ou d'un établissement", 24.87, 15]
    ]
  });

  const emergencySupplements = [
    ["15644", "Supplément de déplacement d'urgence — de 7 h à 16 h", 27.25, "CHSGS — niveau A"],
    ["15645", "Supplément de déplacement d'urgence — de 16 h à 24 h", 38.20, "CHSGS — niveau A"],
    ["15646", "Supplément de déplacement d'urgence — de 0 h à 7 h", 54.50, "CHSGS — niveau A"],
    ["15653", "Supplément de déplacement d'urgence — de 7 h à 16 h", 31.50, "CHSGS — niveau B"],
    ["15654", "Supplément de déplacement d'urgence — de 16 h à 24 h", 44.10, "CHSGS — niveau B"],
    ["15655", "Supplément de déplacement d'urgence — de 0 h à 7 h", 63.00, "CHSGS — niveau B"],
    ["15623", "Supplément de déplacement d'urgence — de 7 h à 16 h", 31.50, "CHSLD ou CHSP — longue durée"],
    ["15624", "Supplément de déplacement d'urgence — de 16 h à 24 h", 44.10, "CHSLD ou CHSP — longue durée"],
    ["15625", "Supplément de déplacement d'urgence — de 0 h à 7 h", 63.00, "CHSLD ou CHSP — longue durée"],
    ["15633", "Supplément de déplacement d'urgence — de 7 h à 16 h", 31.50, "Centre de réadaptation"],
    ["15634", "Supplément de déplacement d'urgence — de 16 h à 24 h", 44.10, "Centre de réadaptation"],
    ["15635", "Supplément de déplacement d'urgence — de 0 h à 7 h", 63.00, "Centre de réadaptation"]
  ];
  emergencySupplements.forEach(([code, description, tariff, context]) => add({
    code,
    description,
    category: "Supplément — patient admis",
    tariff,
    practiceTypes: context.startsWith("CHSGS") ? ["CHSGS"] : context.startsWith("CHSLD") ? ["CHSLD", "CHSP"] : ["Centre de réadaptation"],
    page: 4,
    context,
    tags: ["supplément", "urgence", "déplacement", "patient admis"]
  }));

  /* Pages 5 et 6 — visites sur rendez-vous */
  addCabinetClscRows({
    category: "Visite sur rendez-vous",
    page: 5,
    tags: ["visite", "rendez-vous", "patient inscrit", "moins de 80 ans"],
    rows: [
      ["15801", "Prise en charge — patient non vulnérable, moins de 80 ans, médecin avec moins de 500 patients inscrits", 85.75, 64.50],
      ["15802", "Prise en charge — patient non vulnérable, moins de 80 ans, médecin avec 500 patients inscrits ou plus", 99.40, 74.75],
      ["15803", "Suivi — patient non vulnérable, moins de 80 ans, médecin avec moins de 500 patients inscrits", 42.85, 32.25],
      ["15804", "Suivi — patient non vulnérable, moins de 80 ans, médecin avec 500 patients inscrits ou plus", 49.15, 36.95],
      ["15805", "Prise en charge de grossesse au 1er trimestre sans référence — moins de 500 patients inscrits", 132.80, 99.90],
      ["15806", "Prise en charge de grossesse au 1er trimestre sans référence — 500 patients inscrits ou plus", 151.15, 113.65],
      ["15807", "Prise en charge de grossesse au 1er trimestre avec référence — moins de 500 patients inscrits", 85.75, 64.50],
      ["15808", "Prise en charge de grossesse au 1er trimestre avec référence — 500 patients inscrits ou plus", 97.75, 73.55],
      ["15809", "Prise en charge de grossesse après le 1er trimestre — moins de 500 patients inscrits", 85.75, 64.50],
      ["15810", "Prise en charge de grossesse après le 1er trimestre — 500 patients inscrits ou plus", 97.75, 73.55],
      ["15811", "Suivi de grossesse — moins de 500 patients inscrits", 50.20, 37.75],
      ["15812", "Suivi de grossesse — 500 patients inscrits ou plus", 57.00, 42.85],
      ["15813", "Visite périodique pédiatrique — moins de 500 patients inscrits", 66.90, 50.30],
      ["15814", "Visite périodique pédiatrique — 500 patients inscrits ou plus", 75.85, 57.00],
      ["15821", "Prise en charge — patient vulnérable de moins de 80 ans, médecin avec moins de 500 patients inscrits", 96.35, 72.65],
      ["15822", "Prise en charge — patient vulnérable de moins de 80 ans, médecin avec 500 patients inscrits ou plus", 110.00, 82.90],
      ["15819", "Visite périodique — patient vulnérable de moins de 80 ans, médecin avec moins de 500 patients inscrits", 96.35, 72.65],
      ["15820", "Visite périodique — patient vulnérable de moins de 80 ans, médecin avec 500 patients inscrits ou plus", 112.14, 84.80],
      ["15823", "Suivi — patient vulnérable de moins de 80 ans, médecin avec moins de 500 patients inscrits", 53.50, 40.50],
      ["15824", "Suivi — patient vulnérable de moins de 80 ans, médecin avec 500 patients inscrits ou plus", 59.80, 45.20]
    ]
  });

  addCabinetClscRows({
    category: "Visite sur rendez-vous",
    page: 6,
    tags: ["visite", "rendez-vous", "patient inscrit"],
    rows: [
      ["15825", "Prise en charge de grossesse au 1er trimestre sans référence — patiente vulnérable, moins de 500 patients inscrits", 143.40, 108.05],
      ["15826", "Prise en charge de grossesse au 1er trimestre sans référence — patiente vulnérable, 500 patients inscrits ou plus", 161.75, 121.85],
      ["15827", "Prise en charge de grossesse au 1er trimestre avec référence — patiente vulnérable, moins de 500 patients inscrits", 96.35, 72.65],
      ["15828", "Prise en charge de grossesse au 1er trimestre avec référence — patiente vulnérable, 500 patients inscrits ou plus", 108.40, 81.75],
      ["15829", "Prise en charge de grossesse après le 1er trimestre — patiente vulnérable, moins de 500 patients inscrits", 96.35, 72.65],
      ["15830", "Prise en charge de grossesse après le 1er trimestre — patiente vulnérable, 500 patients inscrits ou plus", 108.40, 81.75],
      ["15831", "Suivi de grossesse — patiente vulnérable, moins de 500 patients inscrits", 60.80, 45.95],
      ["15832", "Suivi de grossesse — patiente vulnérable, 500 patients inscrits ou plus", 67.60, 51.10],
      ["15833", "Visite périodique pédiatrique — patient vulnérable, moins de 500 patients inscrits", 77.55, 58.55],
      ["15834", "Visite périodique pédiatrique — patient vulnérable, 500 patients inscrits ou plus", 86.45, 65.20],
      ["15815", "Prise en charge — patient non vulnérable de 80 ans ou plus, médecin avec moins de 500 patients inscrits", 101.80, 76.55],
      ["15816", "Prise en charge — patient non vulnérable de 80 ans ou plus, médecin avec 500 patients inscrits ou plus", 118.50, 89.15],
      ["15817", "Suivi — patient non vulnérable de 80 ans ou plus, médecin avec moins de 500 patients inscrits", 50.65, 38.15],
      ["15818", "Suivi — patient non vulnérable de 80 ans ou plus, médecin avec 500 patients inscrits ou plus", 58.25, 43.80],
      ["15835", "Prise en charge — patient vulnérable de 80 ans ou plus, médecin avec moins de 500 patients inscrits", 112.40, 84.80],
      ["15836", "Prise en charge — patient vulnérable de 80 ans ou plus, médecin avec 500 patients inscrits ou plus", 129.15, 97.30],
      ["15839", "Visite périodique — patient vulnérable de 80 ans ou plus, médecin avec moins de 500 patients inscrits", 112.40, 84.80],
      ["15840", "Visite périodique — patient vulnérable de 80 ans ou plus, médecin avec 500 patients inscrits ou plus", 129.15, 97.30],
      ["15837", "Suivi — patient vulnérable de 80 ans ou plus, médecin avec moins de 500 patients inscrits", 61.30, 46.30],
      ["15838", "Suivi — patient vulnérable de 80 ans ou plus, médecin avec 500 patients inscrits ou plus", 68.85, 51.95]
    ]
  });

  /* Page 7 — visites ponctuelles */
  addCabinetClscRows({
    category: "Visite ponctuelle",
    page: 7,
    tags: ["visite", "ponctuelle", "sans rendez-vous", "patient non inscrit"],
    extraPracticeTypes: ["Sans rendez-vous"],
    rows: [
      ["15765", "Visite ponctuelle mineure — patient non vulnérable de moins de 80 ans, moins de 500 patients inscrits", 20.40, 15.30],
      ["15766", "Visite ponctuelle mineure — patient non vulnérable de moins de 80 ans, 500 patients inscrits ou plus", 23.55, 17.70],
      ["15773", "Visite ponctuelle complexe — patient non vulnérable de moins de 80 ans, moins de 500 patients inscrits", 40.80, 30.65],
      ["15774", "Visite ponctuelle complexe — patient non vulnérable de moins de 80 ans, 500 patients inscrits ou plus", 47.05, 35.40],
      ["15767", "Visite ponctuelle mineure — patient vulnérable de moins de 80 ans, moins de 500 patients inscrits", 31.00, 23.55],
      ["15768", "Visite ponctuelle mineure — patient vulnérable de moins de 80 ans, 500 patients inscrits ou plus", 34.15, 25.90],
      ["15775", "Visite ponctuelle complexe — patient vulnérable de moins de 80 ans, moins de 500 patients inscrits", 51.40, 38.85],
      ["15776", "Visite ponctuelle complexe — patient vulnérable de moins de 80 ans, 500 patients inscrits ou plus", 57.65, 43.65],
      ["15769", "Visite ponctuelle mineure — patient non vulnérable de 80 ans ou plus, moins de 500 patients inscrits", 24.25, 18.25],
      ["15770", "Visite ponctuelle mineure — patient non vulnérable de 80 ans ou plus, 500 patients inscrits ou plus", 28.05, 21.05],
      ["15777", "Visite ponctuelle complexe — patient non vulnérable de 80 ans ou plus, moins de 500 patients inscrits", 48.50, 36.45],
      ["15778", "Visite ponctuelle complexe — patient non vulnérable de 80 ans ou plus, 500 patients inscrits ou plus", 56.05, 42.15],
      ["15771", "Visite ponctuelle mineure — patient vulnérable de 80 ans ou plus, moins de 500 patients inscrits", 34.90, 26.45],
      ["15772", "Visite ponctuelle mineure — patient vulnérable de 80 ans ou plus, 500 patients inscrits ou plus", 38.65, 29.30],
      ["15779", "Visite ponctuelle complexe — patient vulnérable de 80 ans ou plus, moins de 500 patients inscrits", 59.10, 44.65],
      ["15780", "Visite ponctuelle complexe — patient vulnérable de 80 ans ou plus, 500 patients inscrits ou plus", 66.65, 50.35]
    ]
  });

  /* Page 8 — santé mentale, musculosquelettique, opinions et communications */
  addCabinetClscRows({
    category: "Santé mentale",
    page: 8,
    tags: ["visite", "santé mentale", "psychiatrie", "suivi conjoint"],
    rows: [
      ["08819", "Évaluation psychiatrique en vue d'un suivi conjoint en santé mentale", 99.40, 74.75],
      ["08848", "Suivi conjoint en santé mentale", 73.20, 55.05]
    ]
  });
  addRows({
    category: "Musculosquelettique",
    practiceTypes: ["Cabinet", "GMF"],
    page: 8,
    context: "Cabinet",
    tags: ["visite", "musculosquelettique", "locomoteur"],
    rows: [
      ["08775", "Prise en charge d'un problème musculosquelettique", 99.40],
      ["08776", "Suivi d'un problème musculosquelettique", 49.15],
      ["08777", "Évaluation d'un problème musculosquelettique pour donner une opinion", 99.40]
    ]
  });
  addRows({
    category: "Musculosquelettique",
    practiceTypes: ["CLSC"],
    page: 8,
    context: "CLSC",
    tags: ["visite", "musculosquelettique", "locomoteur"],
    rows: [
      ["08775", "Prise en charge d'un problème musculosquelettique", 74.50],
      ["08776", "Suivi d'un problème musculosquelettique", 36.95],
      ["08777", "Évaluation d'un problème musculosquelettique pour donner une opinion", 74.75]
    ]
  });
  addRows({
    category: "Visite d'opinion",
    practiceTypes: ["Cabinet", "GMF", "CLSC", "GMF-U"],
    page: 8,
    context: "Cabinet, CLSC ou GMF-U selon les conditions RAMQ",
    tags: ["visite", "évaluation", "opinion"],
    rows: [
      ["15789", "Évaluation d'un problème mineur pour donner une opinion", 40.60],
      ["15790", "Évaluation d'un problème complexe pour donner une opinion", 63.00]
    ]
  });
  addCabinetClscRows({
    category: "Communication professionnelle",
    page: 8,
    tags: ["communication", "médecin spécialiste", "professionnel"],
    rows: [
      ["15841", "Communication avec un médecin spécialiste — médecin avec 500 à 999 patients inscrits", 29.30, 22.00],
      ["15842", "Communication avec un médecin spécialiste — médecin avec 1 000 à 1 499 patients inscrits", 29.30, 22.00],
      ["15843", "Communication avec un médecin spécialiste — médecin avec 1 500 patients inscrits ou plus", 29.30, 22.00],
      ["15844", "Communication avec un autre professionnel de la santé — médecin avec 500 à 999 patients inscrits", 20.90, 15.75],
      ["15845", "Communication avec un autre professionnel de la santé — médecin avec 1 000 à 1 499 patients inscrits", 20.90, 15.75],
      ["15846", "Communication avec un autre professionnel de la santé — médecin avec 1 500 patients inscrits ou plus", 20.90, 15.75]
    ]
  });
  addCabinetClscRows({
    category: "Supplément",
    page: 8,
    tags: ["supplément", "urgence", "déplacement"],
    rows: [
      ["15847", "Supplément d'honoraires pour déplacement d'urgence — de 7 h à 16 h", 52.30, 39.35],
      ["15848", "Supplément d'honoraires pour déplacement d'urgence — de 16 h à 24 h", 78.45, 59.00],
      ["15849", "Supplément d'honoraires pour déplacement d'urgence — de 0 h à 7 h", 104.60, 78.65]
    ]
  });

  /* Page 9 — examens psychiatriques */
  addRows({
    category: "Examen psychiatrique complet",
    practiceTypes: ["Clinique externe"],
    page: 9,
    context: "Clinique externe d'un CHSGS",
    tags: ["examen", "psychiatrique", "complet"],
    rows: [
      ["08807", "Examen psychiatrique complet sans déplacement — patient de 0 à 69 ans", 35.85],
      ["08992", "Examen psychiatrique complet sans déplacement — patient de 70 ans ou plus", 37.90],
      ["08808", "Examen psychiatrique complet d'urgence avec déplacement — patient de 0 à 69 ans", 86.25],
      ["08993", "Examen psychiatrique complet d'urgence avec déplacement — patient de 70 ans ou plus", 88.75],
      ["08809", "Examen psychiatrique complet majeur sans déplacement — patient de 0 à 69 ans", 64.80],
      ["08996", "Examen psychiatrique complet majeur sans déplacement — patient de 70 ans ou plus", 66.70],
      ["08810", "Examen psychiatrique complet majeur d'urgence avec déplacement — patient de 0 à 69 ans", 86.25],
      ["08997", "Examen psychiatrique complet majeur d'urgence avec déplacement — patient de 70 ans ou plus", 88.75]
    ]
  });
  addRows({
    category: "Examen psychiatrique complet",
    practiceTypes: ["Urgence", "CLSC réseau de garde"],
    page: 9,
    context: "Service d'urgence CHSGS ou CLSC du réseau de garde",
    tags: ["examen", "psychiatrique", "complet"],
    rows: [
      ["08903", "Examen psychiatrique complet sans déplacement — patient de 0 à 69 ans", 48.80],
      ["08969", "Examen psychiatrique complet sans déplacement — patient de 70 ans ou plus", 51.90],
      ["08806", "Examen psychiatrique complet d'urgence avec déplacement — patient de 0 à 69 ans", 76.25],
      ["08979", "Examen psychiatrique complet d'urgence avec déplacement — patient de 70 ans ou plus", 84.30],
      ["08904", "Examen psychiatrique complet majeur sans déplacement — patient de 0 à 69 ans", 84.10],
      ["08994", "Examen psychiatrique complet majeur sans déplacement — patient de 70 ans ou plus", 89.55],
      ["08907", "Examen psychiatrique complet majeur d'urgence avec déplacement — patient de 0 à 69 ans", 107.00],
      ["08995", "Examen psychiatrique complet majeur d'urgence avec déplacement — patient de 70 ans ou plus", 117.05]
    ]
  });
  addRows({
    category: "Examen psychiatrique complet",
    practiceTypes: ["Patient admis", "CHSGS", "CHSLD", "Centre de réadaptation"],
    page: 9,
    context: "Patient admis — établissement autorisé selon l'onglet B",
    tags: ["examen", "psychiatrique", "complet", "patient admis"],
    rows: [
      ["08811", "Examen psychiatrique complet sans déplacement — patient de 0 à 69 ans", 36.80],
      ["08998", "Examen psychiatrique complet sans déplacement — patient de 70 ans ou plus", 36.80],
      ["09248", "Examen psychiatrique complet ou complet majeur d'urgence avec déplacement — patient de 0 à 69 ans", 79.15],
      ["09245", "Examen psychiatrique complet ou complet majeur d'urgence avec déplacement — patient de 70 ans ou plus", 86.95],
      ["08812", "Examen psychiatrique complet majeur sans déplacement — patient de 0 à 69 ans", 65.15],
      ["08999", "Examen psychiatrique complet majeur sans déplacement — patient de 70 ans ou plus", 67.30]
    ]
  });
  addRows({
    category: "Examen psychiatrique principal",
    practiceTypes: ["Établissement"],
    page: 9,
    context: "Lieu autorisé selon l'onglet B",
    tags: ["examen", "psychiatrique", "principal"],
    rows: [
      ["15066", "Examen psychiatrique principal sans déplacement — patient de 0 à 69 ans", 42.55],
      ["15067", "Examen psychiatrique principal sans déplacement — patient de 70 ans ou plus", 60.00],
      ["15069", "Examen psychiatrique principal d'urgence avec déplacement — patient de 0 à 69 ans", 90.75],
      ["15070", "Examen psychiatrique principal d'urgence avec déplacement — patient de 70 ans ou plus", 98.55]
    ]
  });

  /* Page 10 — patient admis en psychiatrie */
  addRows({
    category: "Psychiatrie — patient admis",
    practiceTypes: ["Psychiatrie", "CHSGS", "CHSP"],
    page: 10,
    context: "CHSGS ou CHSP désigné — patient admis",
    tags: ["psychiatrique", "patient admis", "visite"],
    rows: [
      ["08923", "Visite de prise en charge psychiatrique", 139.30],
      ["08933", "Visite de suivi psychiatrique", 40.60],
      ["08913", "Visite de suivi psychiatrique exigeant un examen", 73.55],
      ["08942", "Visite subséquente de suivi psychiatrique exigeant un examen", 32.90],
      ["08943", "Visite de transfert psychiatrique", 126.10],
      ["08948", "Visite d'évaluation psychiatrique ou d'opinion", 139.30],
      ["08953", "Échange interdisciplinaire avec intervenants ou proches", 24.87, 15],
      ["08966", "Supplément de déplacement d'urgence — de 7 h à 16 h", 31.50],
      ["08967", "Supplément de déplacement d'urgence — de 16 h à 24 h", 44.10],
      ["08968", "Supplément de déplacement d'urgence — de 0 h à 7 h", 63.00]
    ]
  });

  /* Page 11 — domicile, gériatrie et consultations en établissement */
  addRows({
    category: "Visite à domicile",
    practiceTypes: ["Domicile"],
    page: 11,
    context: "Domicile",
    tags: ["visite", "domicile", "perte d'autonomie"],
    rows: [
      ["15781", "Visite d'un patient non vulnérable en perte sévère d'autonomie — premier patient", 133.25],
      ["15782", "Visite d'un patient non vulnérable en perte sévère d'autonomie — patient additionnel", 102.55],
      ["15783", "Visite d'un patient vulnérable en perte sévère d'autonomie — premier patient", 143.85],
      ["15784", "Visite d'un patient vulnérable en perte sévère d'autonomie — patient additionnel", 113.15]
    ]
  });
  addRows({
    category: "Gériatrie de courte durée",
    practiceTypes: ["CHSGS", "CHSLD"],
    page: 11,
    context: "Programme de gériatrie de courte durée — Annexe XXIII",
    tags: ["visite", "gériatrie", "perte d'autonomie"],
    rows: [
      ["15762", "Premier patient en perte sévère d'autonomie — patient de 0 à 69 ans", 89.25],
      ["15763", "Premier patient en perte sévère d'autonomie — patient de 70 ans ou plus", 89.25]
    ]
  });
  addRows({
    category: "Consultation en établissement",
    practiceTypes: ["Clinique externe", "Urgence", "CLSC réseau de garde"],
    page: 11,
    context: "Clinique externe, service d'urgence ou CLSC du réseau de garde intégré",
    tags: ["consultation", "établissement"],
    rows: [
      ["00061", "Consultation mineure sans urgence — patient de moins de 70 ans", 41.85],
      ["09231", "Consultation mineure sans urgence — patient de 70 ans ou plus", 44.95],
      ["15656", "Consultation mineure d'urgence avec déplacement — patient de moins de 70 ans", 122.00],
      ["15659", "Consultation mineure d'urgence avec déplacement — patient de 70 ans ou plus", 139.60],
      ["00060", "Consultation ordinaire sans urgence — patient de moins de 70 ans", 61.40],
      ["09234", "Consultation ordinaire sans urgence — patient de 70 ans ou plus", 66.50],
      ["15657", "Consultation ordinaire d'urgence avec déplacement — patient de moins de 70 ans", 122.00],
      ["15660", "Consultation ordinaire d'urgence avec déplacement — patient de 70 ans ou plus", 139.60],
      ["00062", "Consultation majeure sans urgence — patient de moins de 70 ans", 85.35],
      ["09237", "Consultation majeure sans urgence — patient de 70 ans ou plus", 91.15],
      ["15658", "Consultation majeure d'urgence avec déplacement — patient de moins de 70 ans", 122.00],
      ["15661", "Consultation majeure d'urgence avec déplacement — patient de 70 ans ou plus", 139.60]
    ]
  });

  /* Page 12 — consultations psychiatriques en établissement */
  addRows({
    category: "Consultation psychiatrique",
    practiceTypes: ["Établissement", "Psychiatrie"],
    page: 12,
    context: "Établissement, sauf CLSC ou GMF-U en établissement",
    tags: ["consultation", "psychiatrique", "établissement"],
    rows: [
      ["08800", "Consultation psychiatrique ordinaire sans urgence — patient de moins de 70 ans", 61.95],
      ["08813", "Consultation psychiatrique ordinaire sans urgence — patient de 70 ans ou plus", 66.45],
      ["08802", "Consultation psychiatrique ordinaire d'urgence avec déplacement — patient de moins de 70 ans", 122.00],
      ["08815", "Consultation psychiatrique ordinaire d'urgence avec déplacement — patient de 70 ans ou plus", 139.60],
      ["08803", "Consultation psychiatrique majeure sans urgence — patient de moins de 70 ans", 85.40],
      ["08926", "Consultation psychiatrique majeure sans urgence — patient de 70 ans ou plus", 90.75],
      ["08805", "Consultation psychiatrique majeure d'urgence avec déplacement — patient de moins de 70 ans", 113.75],
      ["08928", "Consultation psychiatrique majeure d'urgence avec déplacement — patient de 70 ans ou plus", 121.90]
    ]
  });

  return codes;
})();
