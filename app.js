const STORAGE_KEY = 'seguimiento-maquinaria-movimientos';
const SESSION_KEY = 'seguimiento-maquinaria-session';
const USERS_STORAGE_KEY = 'seguimiento-maquinaria-usuarios';

// Limpieza única: antes la sesión se guardaba en localStorage (persistía
// entre cierres de pestaña); ahora se guarda en sessionStorage. Se borra
// cualquier resabio antiguo para que no quede una sesión "fantasma".
try { localStorage.removeItem(SESSION_KEY); } catch {}

const seedMovements = [
  { date: '2026-06-26', guide: '28916', machine: '136TRACTOR LAND REXDT85F D', sender: 'TALLER', destination: 'MERCEDES CAROLINA', verification: '', driver: 'RICARDO HERNANDEZ', vehiclePlate: 'IJ-KL-56', note: 'Se envia con su reparacion a huerto', createdBy: 'sistema' },
  { date: '2026-06-26', guide: '28915', machine: '137TRACTOR LAND REXDT85F D', sender: 'TALLER', destination: 'LA POLCURA', verification: '', driver: 'CRISTIAN SILVA', vehiclePlate: 'EF-GH-34', note: 'Se envia a huerto con su reparacion', createdBy: 'sistema' },
  { date: '2026-06-25', guide: '3388', machine: '136TRACTOR LAND REXDT85F D', sender: 'MERCEDES CAROLINA', destination: 'TALLER', verification: 'v', driver: 'RICARDO HERNANDEZ', vehiclePlate: 'IJ-KL-56', note: 'Llega a taller', createdBy: 'sistema' },
  { date: '2026-06-24', guide: '25230', machine: '965RASTRA BALDAN', sender: 'COVADONGA', destination: 'TALLER', verification: 'v', driver: 'VICTOR CALQUIN', vehiclePlate: 'MN-OP-78', note: 'Llega para su reparacion', createdBy: 'sistema' },
  { date: '2026-06-24', guide: '25228', machine: '612AUTOCARGABLE ALDI', sender: 'TALLER', destination: 'LA POLCURA', verification: '√', driver: 'CRISTIAN FAUNDEZ', vehiclePlate: 'AB-CD-12', note: 'Se envia a huerto', createdBy: 'sistema' },
  { date: '2026-06-19', guide: '25218', machine: 'GENERADOR ELECTRICO LIFAN', sender: 'SAN GREGORIO', destination: 'TALLER', verification: 'V', driver: 'VICTOR CALQUIN', vehiclePlate: 'MN-OP-78', note: 'Llega como devolucion', createdBy: 'sistema' },
  { date: '2026-06-18', guide: '25210', machine: '348NEBULIZADORA RAUTOP', sender: 'TALLER', destination: 'SANTA JULIA', verification: '√', driver: 'VICTOR CALQUIN', vehiclePlate: 'MN-OP-78', note: 'Se envia a huerto con su mantencion', createdBy: 'sistema' },
  { date: '2026-01-22', guide: '30077', machine: 'CARDAM - NEB 38 / NEB 35', sender: 'TALLER', destination: 'COVADONGA', verification: '√', driver: 'ABELINO RAMIREZ', vehiclePlate: 'QR-ST-90', note: 'Cambio nudo y cruceta', createdBy: 'sistema' }
];

const DEFAULT_USERS = {
  admin: { username: 'admin', firstName: 'Admin', lastName: 'Sistema', centroCostoAsignado: 'TALLER', email: 'admin@maquinaria.cl', role: 'Administrador', pass: 'admin123' },
  operador1: { username: 'operador1', firstName: 'Juan', lastName: 'Pérez', centroCostoAsignado: 'LA POLCURA', email: 'j.perez@maquinaria.cl', role: 'Usuario', pass: 'oper123' },
  taller1: { username: 'taller1', firstName: 'Carlos', lastName: 'Gómez', centroCostoAsignado: 'TALLER', email: 'c.gomez@maquinaria.cl', role: 'Usuario', pass: 'tall123' }
};

const dom = {
  inactivityOverlay: document.querySelector('#inactivityOverlay'),
  inactivityCountdown: document.querySelector('#inactivityCountdown'),
  inactivityLogoutBtn: document.querySelector('#inactivityLogoutBtn'),
  inactivityContinueBtn: document.querySelector('#inactivityContinueBtn'),
  navItems: document.querySelectorAll('.nav-item'),
  viewTitle: document.querySelector('#view-title'),
  viewSubtitle: document.querySelector('#view-subtitle'),
  metricsGrid: document.querySelector('#metricsGrid'),
  recentRows: document.querySelector('#recentRows'),
  welcomeBannerText: document.querySelector('#welcomeBannerText'),
  welcomeBannerSubtext: document.querySelector('#welcomeBannerSubtext'),
  alertList: document.querySelector('#alertList'),
  // MEJORA 1: filtros temporales/ubicación del Dashboard
  dashboardPeriodFilter: document.querySelector('#dashboardPeriodFilter'),
  dashboardLocationFilter: document.querySelector('#dashboardLocationFilter'),
  // MEJORA 2 y 4: acciones rápidas y badge de auditoría (solo Administrador)
  adminQuickActions: document.querySelector('#adminQuickActions'),
  adminAuditBadge: document.querySelector('#adminAuditBadge'),
  quickUploadMaquinariaBtn: document.querySelector('#quickUploadMaquinariaBtn'),
  quickRegisterUserBtn: document.querySelector('#quickRegisterUserBtn'),
  movementRows: document.querySelector('#movementRows'),
  resultCount: document.querySelector('#resultCount'),
  searchInput: document.querySelector('#searchInput'),
  fromDate: document.querySelector('#fromDate'),
  toDate: document.querySelector('#toDate'),
  openForm: document.querySelector('#openForm'),
  closeForm: document.querySelector('#closeForm'),
  drawer: document.querySelector('#movementDrawer'),
  drawerBackdrop: document.querySelector('#drawerBackdrop'),
  form: document.querySelector('#movementForm'),
  formMessage: document.querySelector('#formMessage'),
  exportCsv: document.querySelector('#exportCsv'),
  machineTags: document.querySelector('#machineTags'),
  driverTags: document.querySelector('#driverTags'),
  vehicleTags: document.querySelector('#vehicleTags'),
  machineCount: document.querySelector('#machineCount'),
  centroCostoCount: document.querySelector('#centroCostoCount'),
  driverCount: document.querySelector('#driverCount'),
  vehicleCount: document.querySelector('#vehicleCount'),
  formSenderSelect: document.querySelector('#formSenderSelect'),
  formSenderSearch: document.querySelector('#formSenderSearch'),
  formDestinationSelect: document.querySelector('#formDestinationSelect'),
  formDestinationSearch: document.querySelector('#formDestinationSearch'),
  formDriverSelect: document.querySelector('#formDriverSelect'),
  formDriverSearch: document.querySelector('#formDriverSearch'),
  formVehicleSelect: document.querySelector('#formVehicleSelect'),
  formVehicleSearch: document.querySelector('#formVehicleSearch'),
  formMachineSelect: document.querySelector('#formMachineSelect'),
  formMachineSearch: document.querySelector('#formMachineSearch'),
  formMachineList: document.querySelector('#formMachineList'),
  
  // Login & Recovery Elements
  loginOverlay: document.querySelector('#loginOverlay'),
  loginForm: document.querySelector('#loginForm'),
  loginUsername: document.querySelector('#loginUsername'),
  loginPassword: document.querySelector('#loginPassword'),
  loginError: document.querySelector('#loginError'),
  sessionUsername: document.querySelector('#sessionUsername'),
  sessionRole: document.querySelector('#sessionRole'),
  userAvatar: document.querySelector('#userAvatar'),
  logoutBtn: document.querySelector('#logoutBtn'),
  loginCardTitle: document.querySelector('#loginCardTitle'),
  loginCardSubtitle: document.querySelector('#loginCardSubtitle'),
  showRecoveryBtn: document.querySelector('#showRecoveryBtn'),
  recoveryForm: document.querySelector('#recoveryForm'),
  recoveryInput: document.querySelector('#recoveryInput'),
  recoveryMessage: document.querySelector('#recoveryMessage'),
  backToLoginBtn: document.querySelector('#backToLoginBtn'),

  // Action & Edit Elements
  drawerTitle: document.querySelector('#drawerTitle'),
  formGuideInput: document.querySelector('#formGuideInput'),
  formDocTypeSelect: document.querySelector('#formDocTypeSelect'),
  formMemoInput: document.querySelector('#formMemoInput'),
  guideFieldLabel: document.querySelector('#guideFieldLabel'),
  memoFieldLabel: document.querySelector('#memoFieldLabel'),
  movementsTable: document.querySelector('#movementsTable'),

  // Detail Drawer Elements
  detailDrawer: document.querySelector('#detailDrawer'),
  closeDetail: document.querySelector('#closeDetail'),
  detailSubtitle: document.querySelector('#detailSubtitle'),
  detailGuide: document.querySelector('#detailGuide'),
  detailGuideLabel: document.querySelector('#detailGuideLabel'),
  detailMachine: document.querySelector('#detailMachine'),
  detailDriver: document.querySelector('#detailDriver'),
  detailPlate: document.querySelector('#detailPlate'),
  detailVehicleBrand: document.querySelector('#detailVehicleBrand'),
  detailVehicleType: document.querySelector('#detailVehicleType'),
  detailVehicleColor: document.querySelector('#detailVehicleColor'),
  detailSenderUser: document.querySelector('#detailSenderUser'),
  detailSenderCentro: document.querySelector('#detailSenderCentro'),
  detailDestination: document.querySelector('#detailDestination'),
  detailVerifiedBy: document.querySelector('#detailVerifiedBy'),
  detailVerification: document.querySelector('#detailVerification'),
  detailDate: document.querySelector('#detailDate'),
  detailReceivedDate: document.querySelector('#detailReceivedDate'),
  detailNotePanel: document.querySelector('#detailNotePanel'),
  detailNote: document.querySelector('#detailNote'),

  // Users Management Elements
  navUsers: document.querySelector('#navUsers'),
  userForm: document.querySelector('#userForm'),
  userFormUsername: document.querySelector('#userFormUsername'),
  userFormTitle: document.querySelector('#userFormTitle'),
  userFormMessage: document.querySelector('#userFormMessage'),
  userFormCancel: document.querySelector('#userFormCancel'),
  userRows: document.querySelector('#userRows'),
  clearRecoveryAuditBtn: document.querySelector('#clearRecoveryAuditBtn'),
  recoveryAuditRows: document.querySelector('#recoveryAuditRows'),

  // Profile View Elements
  profileAvatar: document.querySelector('#profileAvatar'),
  profileFullName: document.querySelector('#profileFullName'),
  profileRoleText: document.querySelector('#profileRoleText'),
  profileUsername: document.querySelector('#profileUsername'),
  profileEmail: document.querySelector('#profileEmail'),
  profileCentroCosto: document.querySelector('#profileCentroCosto'),

  // User Form Centro de Trabajo Element
  userFormCentroCostoSelect: document.querySelector('#userFormCentroCostoSelect')
};

// ============================================================
// Capa de conexión con Supabase
// ============================================================
const sb = (typeof window !== 'undefined' && window.supabaseClient) ? window.supabaseClient : null;
const SUPABASE_READY = !!sb;

function sbError(context, error) {
  if (error) console.error(`[Supabase] Error en ${context}:`, error.message || error);
}

async function sbReplaceAll(table, rows, matchAllColumn) {
  if (!sb) return;
  const { error: delErr } = await sb.from(table).delete().not(matchAllColumn, 'is', null);
  if (delErr) return sbError(`limpiar tabla ${table}`, delErr);
  if (!rows.length) return;
  const { error: insErr } = await sb.from(table).insert(rows);
  if (insErr) sbError(`insertar en tabla ${table}`, insErr);
}

async function pushCentrosCostoToSupabase(list) {
  if (!sb) return;
  await sbReplaceAll('centros_costo', list.map(c => ({ nombre: c.nombre, numero: c.numero })), 'nombre');
}

async function pushChoferesToSupabase(list) {
  if (!sb) return;
  await sbReplaceAll('choferes', list.map(d => ({ first_name: d.firstName, last_name: d.lastName })), 'first_name');
}

async function pushVehiculosToSupabase(list) {
  if (!sb) return;
  await sbReplaceAll('vehiculos', list.map(v => ({ plate: v.plate, marca: v.marca, tipo: v.tipo, color: v.color })), 'plate');
}

async function pushMaquinariaToSupabase(list) {
  if (!sb) return;
  await sbReplaceAll('maquinaria', list.map(m => ({ codigo: m.codigo, descripcion: m.descripcion })), 'codigo');
}

async function pushUsuariosToSupabase(usersObj) {
  if (!sb) return;
  const rows = Object.values(usersObj).map(u => ({
    username: u.username,
    first_name: u.firstName,
    last_name: u.lastName,
    centro_costo_asignado: u.centroCostoAsignado,
    email: u.email,
    role: u.role,
    password_hash: u.pass
  }));
  await sbReplaceAll('usuarios', rows, 'username');
}

async function pushMovementsToSupabase(list) {
  if (!sb) return;
  const rows = list.map(m => ({
    id: m.id,
    fecha: m.date,
    doc_type: m.docType || 'Guía',
    guide: String(m.guide),
    machine: m.machine,
    sender: m.sender,
    destination: m.destination,
    driver: m.driver,
    vehicle_plate: m.vehiclePlate,
    verification: m.verification,
    verified_by: m.verifiedBy || null,
    received_date: m.receivedDate || null,
    note: m.note || '',
    created_by: m.createdBy,
    modified_by: m.modifiedBy || null,
    modified_at: m.modifiedAt || null
  }));
  await sbReplaceAll('movimientos', rows, 'id');
}

async function bootstrapFromSupabase() {
  if (!sb) return;
  try {
    const [cc, ch, vh, mq, us, mv] = await Promise.all([
      sb.from('centros_costo').select('*'),
      sb.from('choferes').select('*'),
      sb.from('vehiculos').select('*'),
      sb.from('maquinaria').select('*'),
      sb.from('usuarios').select('*'),
      sb.from('movimientos').select('*')
    ]);

    if (cc.error || ch.error || vh.error || mq.error || us.error || mv.error) {
      sbError('bootstrap inicial', cc.error || ch.error || vh.error || mq.error || us.error || mv.error);
      return;
    }

    if (cc.data) {
      localStorage.setItem(CENTROS_COSTO_KEY, JSON.stringify(
        cc.data.map(r => ({ nombre: r.nombre, numero: r.numero }))
      ));
    }
    if (ch.data) {
      localStorage.setItem(CHOFERES_KEY, JSON.stringify(
        ch.data.map(r => ({ firstName: r.first_name, lastName: r.last_name }))
      ));
    }
    if (vh.data) {
      localStorage.setItem(VEHICULOS_KEY, JSON.stringify(
        vh.data.map(r => ({ plate: r.plate, marca: r.marca, tipo: r.tipo, color: r.color }))
      ));
    }
    if (mq.data) {
      localStorage.setItem(MAQUINARIA_KEY, JSON.stringify(
        mq.data.map(r => ({ codigo: r.codigo, descripcion: r.descripcion }))
      ));
    }
    if (us.data) {
      const usersObj = {};
      us.data.forEach(r => {
        usersObj[r.username] = {
          username: r.username,
          firstName: r.first_name,
          lastName: r.last_name,
          centroCostoAsignado: r.centro_costo_asignado,
          email: r.email,
          role: r.role,
          pass: r.password_hash
        };
      });
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(usersObj));
    }
    if (mv.data) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(
        mv.data.map(r => ({
          id: r.id,
          date: r.fecha,
          docType: r.doc_type,
          guide: r.guide,
          machine: r.machine,
          sender: r.sender,
          destination: r.destination,
          driver: r.driver,
          vehiclePlate: r.vehicle_plate,
          verification: r.verification,
          verifiedBy: r.verified_by,
          receivedDate: r.received_date,
          note: r.note,
          createdBy: r.created_by,
          modifiedBy: r.modified_by,
          modifiedAt: r.modified_at
        }))
      ));
    }
  } catch (err) {
    sbError('bootstrap inicial (excepción)', err);
  }
}

const CENTROS_COSTO_KEY = 'seguimiento-maquinaria-centros-costo';
const EMISORES_KEY = 'seguimiento-maquinaria-emisores';
const DESTINOS_KEY = 'seguimiento-maquinaria-destinos';
const CHOFERES_KEY = 'seguimiento-maquinaria-choferes';
const VEHICULOS_KEY = 'seguimiento-maquinaria-vehiculos';
const MAQUINARIA_KEY = 'seguimiento-maquinaria-catalogo-maquinaria';

const defaultCentrosCosto = [
  { nombre: 'TALLER', numero: 'CC-001' },
  { nombre: 'MERCEDES CAROLINA', numero: 'CC-002' },
  { nombre: 'COVADONGA', numero: 'CC-003' },
  { nombre: 'LA POLCURA', numero: 'CC-004' },
  { nombre: 'SAN GREGORIO', numero: 'CC-005' },
  { nombre: 'SANTA JULIA', numero: 'CC-006' }
];
const defaultChoferes = [
  { firstName: 'Ricardo', lastName: 'Hernández' },
  { firstName: 'Cristian', lastName: 'Silva' },
  { firstName: 'Víctor', lastName: 'Calquín' },
  { firstName: 'Cristian', lastName: 'Faundez' },
  { firstName: 'Abelino', lastName: 'Ramírez' }
];
const defaultVehiculos = ['IJ-KL-56', 'EF-GH-34', 'MN-OP-78', 'AB-CD-12', 'QR-ST-90'];

// Catálogo por defecto de Maquinaria, cargado inicialmente desde el Excel
// "Maquinaria" provisto (columnas Cod. Maquina / Desc. Maquina). El
// Administrador puede reemplazarlo cargando un nuevo Excel desde la vista
// Maquinaria, o editarlo manualmente.
const defaultMaquinaria = [{codigo:'0',descripcion:'NO USAR'},{codigo:'1',descripcion:'MOTO BLANCA #1'},{codigo:'2',descripcion:'MOTO SANTA JULIA #2'},{codigo:'3',descripcion:'BUGGY #3'},{codigo:'4',descripcion:'MOTO M CAROLINA #4'},{codigo:'5',descripcion:'TROMPO LEMACO #5'},{codigo:'6',descripcion:'TRACTOR JARDINES #6'},{codigo:'7',descripcion:'MOTO HONDA 2021 #7'},{codigo:'8',descripcion:'MOTO HONDA XR 150 #8'},{codigo:'28',descripcion:'CAMIONETA GXGD 31 #28'},{codigo:'31',descripcion:'CAMIONETA LJYZ 60 #31'},{codigo:'36',descripcion:'CAMIONETA TN 7636 #36'},{codigo:'43',descripcion:'CAMIONETA TVYC 43 #43'},{codigo:'44',descripcion:'CAMIONETA FPBV 44 #44'},{codigo:'45',descripcion:'CAMIONETA GSRK 45 #45'},{codigo:'46',descripcion:'CAMIONETA TVYC 44-6 #46'},{codigo:'47',descripcion:'CAMIONETA DGTD 47 #47'},{codigo:'53',descripcion:'CAMIONETA KSXW 53 #53'},{codigo:'60',descripcion:'CAMIONETA FXXX 60 #60'},{codigo:'69',descripcion:'AUTO CASINO GFLG 69 #69'},{codigo:'76',descripcion:'GRUA YALE ELECTRICA #76'},{codigo:'82',descripcion:'CAMIONETA FCKZ 82 #82'},{codigo:'91',descripcion:'CAMION KX 5691 #91'},{codigo:'100',descripcion:'TRACTOR ARRIENDO #00'},{codigo:'102',descripcion:'TRACTOR MF 265 A #02'},{codigo:'103',descripcion:'TRACTOR MF 165 I #03'},{codigo:'107',descripcion:'TRACTOR MF 290 B #07'},{codigo:'108',descripcion:'TRACTOR MF 290 B #08'},{codigo:'109',descripcion:'TRACTOR MF 135 I #09'},{codigo:'110',descripcion:'TRACTOR MF 265 A #10'},{codigo:'111',descripcion:'TRACTOR MF 265 A #11'},{codigo:'113',descripcion:'TRACTOR MF 265 B #13'},{codigo:'114',descripcion:'TRACTOR MF 265 A #14'},{codigo:'116',descripcion:'TRACTOR MF 265 B #16'},{codigo:'117',descripcion:'TRACTOR MF 265 B #17'},{codigo:'118',descripcion:'TRACTOR MF 290 B #18'},{codigo:'119',descripcion:'TRACTOR MF 265 B #19'},{codigo:'120',descripcion:'TRACTOR MF 265 B #20'},{codigo:'121',descripcion:'TRACTOR MF 265 B #21'},{codigo:'122',descripcion:'TRACTOR MF 265 B #22'},{codigo:'123',descripcion:'TRACTOR MF 290 B #23'},{codigo:'124',descripcion:'TRACTOR MF 292 B #24'},{codigo:'125',descripcion:'TRACTOR MF 275 B #25'},{codigo:'126',descripcion:'TRACTOR MF 275 B #26'},{codigo:'127',descripcion:'TRACTOR MF 265 B #27'},{codigo:'128',descripcion:'TRACTOR MF 265 B #28'},{codigo:'129',descripcion:'TRACTOR MF 275 B #29'},{codigo:'130',descripcion:'TRACTOR MF 275 B #30'},{codigo:'131',descripcion:'TRACTOR MF 275 B #31'},{codigo:'132',descripcion:'TRACTOR MF 275 B #32'},{codigo:'133',descripcion:'TRACTOR MF 275 B #33'},{codigo:'134',descripcion:'TRACTOR FARM FT60 I #34'},{codigo:'135',descripcion:'TRACTOR FARM FT60 I #35'},{codigo:'136',descripcion:'TRACTOR LAND REX 85F #36'},{codigo:'137',descripcion:'TRACTOR LAND REX 85F #37'},{codigo:'138',descripcion:'TRACTOR LAND REX 85F #38'},{codigo:'139',descripcion:'TRACTOR LAND REX 85F #39'},{codigo:'140',descripcion:'adm agricola 6-2021 #40'},{codigo:'141',descripcion:'TRACTOR MF 275 B #41'},{codigo:'142',descripcion:'TRACTOR MF 275 B #42'},{codigo:'143',descripcion:'TRACTOR MF 275 B #43'},{codigo:'144',descripcion:'TRACTOR MF 275 B #44'},{codigo:'145',descripcion:'TRACTOR MF 275 B #45'},{codigo:'146',descripcion:'TRACTOR MF 275 B #46'},{codigo:'147',descripcion:'TRACTOR MF 275 T #47'},{codigo:'148',descripcion:'TRACTOR MF 275 T #48'},{codigo:'149',descripcion:'TRACTOR MF 75 HP DT #49'},{codigo:'150',descripcion:'TRACTOR MF 75 HP DT #50'},{codigo:'151',descripcion:'no ocupar 01-06-2022 #51'},{codigo:'152',descripcion:'TRACTOR MF 75 HP DT #52'},{codigo:'153',descripcion:'TRACTOR MF 4275 T4F #53'},{codigo:'154',descripcion:'TRACTOR MF 4275 T4F #54'},{codigo:'155',descripcion:'TRACTOR MF 4275 T4F #55'},{codigo:'156',descripcion:'TRACTOR MF 4275 T4F #56'},{codigo:'157',descripcion:'TRACTOR REXD790F #57'},{codigo:'158',descripcion:'TRACTOR REXD790F #58'},{codigo:'159',descripcion:'TRACTOR REXD790F #59'},{codigo:'160',descripcion:'TRACTORT NEW HOLLAND #60'},{codigo:'161',descripcion:'TRACTOR NEW HOLLAND #61'},{codigo:'162',descripcion:'TRACTOR SONALIKA #62'},{codigo:'163',descripcion:'TRACTOR SONALIKA #63'},{codigo:'201',descripcion:'RANA DOSAL #01'},{codigo:'202',descripcion:'RANA DOSAL #02'},{codigo:'212',descripcion:'RANA DOSAL #12'},{codigo:'213',descripcion:'RANA DOSAL #13'},{codigo:'221',descripcion:'RANA DOSAL #21'},{codigo:'232',descripcion:'RANA DOSAL #32'},{codigo:'233',descripcion:'RANA DOSAL #33'},{codigo:'234',descripcion:'RANA DOSAL #34'},{codigo:'241',descripcion:'RANA FIMAGRO #41'},{codigo:'242',descripcion:'RANA FIMAGRO #42'},{codigo:'243',descripcion:'RANA FIMAGRO #43'},{codigo:'251',descripcion:'RANA DOSAL #51'},{codigo:'261',descripcion:'RANA DOSAL #61'},{codigo:'262',descripcion:'RANA DOSAL #62'},{codigo:'301',descripcion:'NEBULIZADORA PARROTH #01'},{codigo:'302',descripcion:'NEBULIZADORA PARROTH #02'},{codigo:'303',descripcion:'NEBULIZADORA ALDI #03'},{codigo:'306',descripcion:'NEBULIZADORA DOSAL #06'},{codigo:'311',descripcion:'NEBULIZADORA PARROTH #11'},{codigo:'312',descripcion:'NEBULIZADORA PARROTH #12'},{codigo:'313',descripcion:'NEBULIZADORA RAUTOP #13'},{codigo:'314',descripcion:'NEBULIZADORA RAUTOP #14'},{codigo:'315',descripcion:'NEBULIZADORA RAUTOP #15'},{codigo:'316',descripcion:'NEBULIZADORA RAUTOP #16'},{codigo:'321',descripcion:'NEBULIZADORA PARROTH #21'},{codigo:'322',descripcion:'NEBULIZADORA PARROTH #22'},{codigo:'331',descripcion:'NEBULIZADORA RIAL #31'},{codigo:'332',descripcion:'NEBULIZADORA RIAL #32'},{codigo:'333',descripcion:'NEBULIZADORA RIAL #33'},{codigo:'334',descripcion:'NEBULIZADORA PARROTH #34'},{codigo:'335',descripcion:'NEBULIZADORA ALDI #35'},{codigo:'336',descripcion:'NEBULIZADORA ALDI #36'},{codigo:'337',descripcion:'NEBULIZADORA PARROTH #37'},{codigo:'338',descripcion:'NEBULIZADORA RAUTOP #38'},{codigo:'341',descripcion:'NEBULIZADORA RIAL #41'},{codigo:'342',descripcion:'NEBULIZADORA RIAL #42'},{codigo:'343',descripcion:'NEBULIZADORA RIAL 9-201 #43'},{codigo:'344',descripcion:'NEBULIZADORA RIAL #44'},{codigo:'345',descripcion:'NEBULIZADORA ALDI #45'},{codigo:'346',descripcion:'NEBULIZADORA RAUTOP #46'},{codigo:'347',descripcion:'NEBULIZADORA RAUTOP #47'},{codigo:'348',descripcion:'NEBULIZADORA RAUTOP #48'},{codigo:'349',descripcion:'NEBULIZADORA RAUTOP #49'},{codigo:'351',descripcion:'NEBULIZADORA RIAL #51'},{codigo:'352',descripcion:'NEBULIZADORA PARROTH #52'},{codigo:'353',descripcion:'NEBULIZADORA PARROTH #53'},{codigo:'361',descripcion:'NEBULIZADORA ALDI #61'},{codigo:'362',descripcion:'NEBULIZADORA ALDI #62'},{codigo:'363',descripcion:'NEBULIZADORA ALDI #63'},{codigo:'364',descripcion:'NEBULIZADORA ALDI #64'},{codigo:'365',descripcion:'NEBULIZADORA ALDI #65'},{codigo:'366',descripcion:'NEBULIZADORA ALDI #66'},{codigo:'370',descripcion:'HIDROLAVADORA PRO CANCE #70'},{codigo:'381',descripcion:'GENERADOR SADEMA #81'},{codigo:'382',descripcion:'GENERADOR PRESIZER #82'},{codigo:'383',descripcion:'GENERADOR PACKING #83'},{codigo:'390',descripcion:'MOTO BB HONDA GX 160 WN #90'},{codigo:'402',descripcion:'TRITURADORA BERTI #02'},{codigo:'431',descripcion:'TRITURADORA DAVID #31'},{codigo:'451',descripcion:'REV DE COMPOST DOSAL #51'},{codigo:'452',descripcion:'MEZCLADORA DE HUMUS DOS #52'},{codigo:'453',descripcion:'CENTRIFUGA DE HUMUS DOS #53'},{codigo:'454',descripcion:'CENTRIFUGA DE HUMUS #54'},{codigo:'461',descripcion:'TRITURADORA PARROTH #61'},{codigo:'462',descripcion:'TRITURADORA PICKER 180 #62'},{codigo:'470',descripcion:'adm agricola 6-2021 #70'},{codigo:'471',descripcion:'COMEDOR MOVIL PU #71'},{codigo:'472',descripcion:'COMERDOR MOVIL ( MC ) #72'},{codigo:'473',descripcion:'COMEDOR MOVIL O #73'},{codigo:'474',descripcion:'COMEDOR MOVIL CONV VIEJ #74'},{codigo:'475',descripcion:'COMEDOR MOVIL D L #75'},{codigo:'476',descripcion:'COMEDOR MOVIL LA PU #76'},{codigo:'477',descripcion:'COMNEDOR MOVIL LA PU #77'},{codigo:'478',descripcion:'COMEDOR MOVIL LA PU #78'},{codigo:'479',descripcion:'COMEDOR MOVIL LA PU #79'},{codigo:'480',descripcion:'COMEDOR MOVIL SA #80'},{codigo:'481',descripcion:'COMEDOR MOVIL SA #81'},{codigo:'482',descripcion:'COMEDOR MOVIL SA #82'},{codigo:'483',descripcion:'COMEDOR MOVIL SA #83'},{codigo:'484',descripcion:'COMEDOR MOVIL MC #84'},{codigo:'485',descripcion:'COMEDOR MOVIL MC #85'},{codigo:'486',descripcion:'COMEDOR MOVIL MC #86'},{codigo:'487',descripcion:'COMEDOR MOVIL MC #87'},{codigo:'490',descripcion:'DESMALEZADORA FS 250 #90'},{codigo:'491',descripcion:'MOTOSIERRA 250 S/ESP-CA #91'},{codigo:'492',descripcion:'DESMALEZADORA FS 300 #92'},{codigo:'493',descripcion:'DESMALEZADORA FS 300 #93'},{codigo:'494',descripcion:'DESMALEZADORA FS 300 #94'},{codigo:'495',descripcion:'DESMALEZADORA FS 300 #95'},{codigo:'496',descripcion:'DESMALEZADORA FS 300 #96'},{codigo:'497',descripcion:'DESMALEZADORA FS 300 #97'},{codigo:'498',descripcion:'DESMALEZADORA FS 300C/T #98'},{codigo:'499',descripcion:'DESMALEZADORA FS 300C/T #99'},{codigo:'503',descripcion:'CARRO SIMPLE FIMAGRO #03'},{codigo:'506',descripcion:'CARRO SIMPLE FIMAGRO #06'},{codigo:'507',descripcion:'CARRO SIMPLE FIMAGRO #07'},{codigo:'510',descripcion:'CARRO SIMPLE FIMAGRO #10'},{codigo:'511',descripcion:'CARRO SIMPLE FIMAGRO #11'},{codigo:'512',descripcion:'CARRO SIMPLE FIMAGRO #12'},{codigo:'513',descripcion:'CARRO SIMPLE FIMAGRO #13'},{codigo:'514',descripcion:'CARRO SIMPLE DOSAl #14'},{codigo:'531',descripcion:'CARRO SIMPLE FIMAGRO #31'},{codigo:'534',descripcion:'CARRO SIMPLE FIMAGRO #34'},{codigo:'541',descripcion:'CARRO SIMPLE FIMAGRO #41'},{codigo:'542',descripcion:'CARRO SIMPLE FIMAGRO #42'},{codigo:'551',descripcion:'CARRO SIMPLE FIMAGRO #51'},{codigo:'552',descripcion:'CARRO SIMPLE FIMAGRO #52'},{codigo:'553',descripcion:'CARRO SIMPLE FIMAGRO #53'},{codigo:'561',descripcion:'CARRO SIMPLE DOSAL #61'},{codigo:'562',descripcion:'CARRO SIMPLE DOSAL #62'},{codigo:'590',descripcion:'CARRO CISTERNA S G #90'},{codigo:'612',descripcion:'AUTOCARGABLE ALDI #12'},{codigo:'621',descripcion:'AUTOCARGABLE #21'},{codigo:'631',descripcion:'AUTOCARGABLE #31'},{codigo:'632',descripcion:'AUTOCARGABLE #32'},{codigo:'633',descripcion:'AUTOCARGABLE #33'},{codigo:'634',descripcion:'AUTOCARGABLE METALTEC #34'},{codigo:'641',descripcion:'AUTOCARGABLE FMA #41'},{codigo:'642',descripcion:'AUTOCARGABLE FMNA #42'},{codigo:'644',descripcion:'AUTOCARGABLE METALTEC #44'},{codigo:'645',descripcion:'AUTOCARGABLE METALTEC #45'},{codigo:'646',descripcion:'AUCOCARGABLE METALTEC #46'},{codigo:'647',descripcion:'AUTOCARGABLE METALTEC #47'},{codigo:'651',descripcion:'AUTOCARGABLE #51'},{codigo:'652',descripcion:'AUTOCARGABLE FMA #52'},{codigo:'653',descripcion:'AUTOCARGABLE FMA #53'},{codigo:'661',descripcion:'AUTOCARGABLE #61'},{codigo:'662',descripcion:'AUTOCARGABLE de DL #62'},{codigo:'663',descripcion:'AUTOCARGABLE #63'},{codigo:'664',descripcion:'AUTOCARGABLE METALTEC #64'},{codigo:'665',descripcion:'AUTOCARGABLE METALTEC #65'},{codigo:'701',descripcion:'GRUA YALE #01'},{codigo:'703',descripcion:'TRASPALETA ELECTRICA #03'},{codigo:'704',descripcion:'TRASPALETA ELECTRICA #04'},{codigo:'705',descripcion:'TRASPALETA ELECTRICA #05'},{codigo:'708',descripcion:'GRUA CLARK #08'},{codigo:'710',descripcion:'GRUA MITSUBISHI #10'},{codigo:'711',descripcion:'GRUA MITSUBISHI #11'},{codigo:'712',descripcion:'GRUA MITSUBISHI #12'},{codigo:'713',descripcion:'GRUA CLARK #13'},{codigo:'715',descripcion:'GRUA YALE #15'},{codigo:'716',descripcion:'GRUA YALE #16'},{codigo:'717',descripcion:'GRUA YALE #17'},{codigo:'718',descripcion:'GRUA YALE #18'},{codigo:'719',descripcion:'GRUA YALE #19'},{codigo:'720',descripcion:'GRUA YALE #20'},{codigo:'721',descripcion:'GRUA YALE #21'},{codigo:'722',descripcion:'GRUA YALE #22'},{codigo:'723',descripcion:'GRUA YALE #23'},{codigo:'724',descripcion:'GRUA YALE #24'},{codigo:'725',descripcion:'GRUA YALE #25'},{codigo:'726',descripcion:'GRUA YALE #26'},{codigo:'727',descripcion:'GRUA YALE #27'},{codigo:'728',descripcion:'GRUA YALE #28'},{codigo:'729',descripcion:'GRUA YALE #29'},{codigo:'730',descripcion:'GRUA YALE #30'},{codigo:'731',descripcion:'GRUA YALE #31'},{codigo:'732',descripcion:'GRUA YALE #32'},{codigo:'733',descripcion:'GRUA YALE #33'},{codigo:'734',descripcion:'GRUA YALE #34'},{codigo:'735',descripcion:'GRUA YALE #35'},{codigo:'736',descripcion:'GRUA LIMNDE #36'},{codigo:'737',descripcion:'GRUA HISTER #37'},{codigo:'738',descripcion:'GRUA NICHIYU #38'},{codigo:'739',descripcion:'GRUA NICHIYU #39'},{codigo:'740',descripcion:'GRUA NICHIYU #40'},{codigo:'741',descripcion:'GRUA NICHIYU #41'},{codigo:'742',descripcion:'GRUA YALE #42'},{codigo:'743',descripcion:'GRUA YALE #43'},{codigo:'744',descripcion:'GRUA YALE #44'},{codigo:'745',descripcion:'GRUA YALE #45'},{codigo:'746',descripcion:'GRUA YALE #46'},{codigo:'747',descripcion:'GRUA YALE #47'},{codigo:'748',descripcion:'GRUA YALE #48'},{codigo:'749',descripcion:'GRUA YALE #49'},{codigo:'750',descripcion:'GRUA YALE #50'},{codigo:'751',descripcion:'GRUA YALE #51'},{codigo:'752',descripcion:'GRUA YALE #52'},{codigo:'753',descripcion:'GRUA YALE #53'},{codigo:'754',descripcion:'GRUA YALE #54'},{codigo:'755',descripcion:'GRUA YALE #55'},{codigo:'756',descripcion:'GRUA YALE #56'},{codigo:'757',descripcion:'GRUA YALE #57'},{codigo:'758',descripcion:'GRUA YALE #58'},{codigo:'759',descripcion:'GRUA YALE ELECTRICA #59'},{codigo:'760',descripcion:'GRUA YALE ELECTRICA #60'},{codigo:'761',descripcion:'GRUA YALE #61'},{codigo:'762',descripcion:'GRUA YALE #62'},{codigo:'763',descripcion:'GRUA YALE #63'},{codigo:'764',descripcion:'GRUA YALE #64'},{codigo:'765',descripcion:'GRUA YALE ELECTRICA #65'},{codigo:'766',descripcion:'GRUA YALE ELECTRICA #66'},{codigo:'767',descripcion:'GRUA YALE ELECTRICA #67'},{codigo:'768',descripcion:'GRUA YALE ELECTRICA #68'},{codigo:'801',descripcion:'APLICADOR HERBICIDA ALD #01'},{codigo:'802',descripcion:'APLICADOR HERBICIDA DOS #02'},{codigo:'831',descripcion:'APLICADOR HERBICID RIAL #31'},{codigo:'832',descripcion:'APLICADORA HERBIC RAUTO #32'},{codigo:'841',descripcion:'APLICADOR HERBICIDA ALD #41'},{codigo:'850',descripcion:'CARRO TOLVA 5000 KG #50'},{codigo:'851',descripcion:'APLICADOR HERBICIDA RIA #51'},{codigo:'861',descripcion:'APLICADOR HERBICIDA #61'},{codigo:'862',descripcion:'APLICADOR HERBICID DOSA #62'},{codigo:'884',descripcion:'PODADOR CARGA STIHL #84'},{codigo:'885',descripcion:'PODADOR CARGA STIHL #85'},{codigo:'886',descripcion:'PODADOR ALTURA STIHL #86'},{codigo:'887',descripcion:'PODADOR ALTURA STIHL #87'},{codigo:'888',descripcion:'PODADOR ALTURA STIHL #88'},{codigo:'890',descripcion:'TINA DOSAL #90'},{codigo:'891',descripcion:'TINA DOSAL #91'},{codigo:'892',descripcion:'TINA DOSAL #92'},{codigo:'893',descripcion:'TINA DOSAL #93'},{codigo:'894',descripcion:'TINA DOSAL #94'},{codigo:'895',descripcion:'BARRA MANUAL 12MT HERBI #95'},{codigo:'898',descripcion:'MOTOSIERRA 250 S/ESP #98'},{codigo:'899',descripcion:'RASTRA ARADORA 18 D 24" #99'},{codigo:'900',descripcion:'PODADORA NUSQV ALTURA #00'},{codigo:'901',descripcion:'BANO QUIMICO ALDI #01'},{codigo:'902',descripcion:'BANO QUIMICO ALDI #02'},{codigo:'903',descripcion:'BANO QUIMICO DOSAL #03'},{codigo:'904',descripcion:'BANO QUIMICO DOSAL #04'},{codigo:'905',descripcion:'PALA DE COLA #05'},{codigo:'906',descripcion:'RASTRA DOSAL #06'},{codigo:'907',descripcion:'ABONADORA PARROTH #07'},{codigo:'908',descripcion:'APLICADOR PROTECSOL DOS #08'},{codigo:'910',descripcion:'ARADO APAORCADOR DOSAL #10'},{codigo:'911',descripcion:'ARADO APORCADOR DOSAL #11'},{codigo:'912',descripcion:'EQUIPO PODA NEUMATICA I #12'},{codigo:'913',descripcion:'BANO QUIMICO DOSAL #13'},{codigo:'914',descripcion:'BANO QUIMICO ALDI #14'},{codigo:'915',descripcion:'MOTOBOMBA KRAFTER #15'},{codigo:'916',descripcion:'BOMBA DESEL 3X3 SDP ACO #16'},{codigo:'917',descripcion:'EQUIPO DE PODA NEUMATIC #17'},{codigo:'918',descripcion:'MOTOBOMBA DIESEL 3X3 83 #18'},{codigo:'919',descripcion:'PALA DE COLA SIN MARCA #19'},{codigo:'920',descripcion:'BANO QUIMICO DOSAL #20'},{codigo:'921',descripcion:'BANO QUIMICO ALDI #21'},{codigo:'922',descripcion:'BANO QUIMICO DOSAL #22'},{codigo:'923',descripcion:'BANO QUIMICO DOSAL #23'},{codigo:'924',descripcion:'EQUIPO PODA NEUMATICA I #24'},{codigo:'925',descripcion:'APLICADOR PROTECSOL DOS #25'},{codigo:'926',descripcion:'ARADO WITRE #26'},{codigo:'927',descripcion:'ARADO CABALLO #27'},{codigo:'928',descripcion:'TRACTO ELEVADOR #28'},{codigo:'929',descripcion:'REMOVEDOR DE COMPOST #29'},{codigo:'930',descripcion:'MOTOBBA DIESEL 830LT TO #30'},{codigo:'931',descripcion:'BANO QUIMICO DOSAL #31'},{codigo:'932',descripcion:'BANO QUIMICO DOSAL #32'},{codigo:'933',descripcion:'TRACTO ELEVADOR #33'},{codigo:'934',descripcion:'APLICADOR PROTECSOL DOS #34'},{codigo:'935',descripcion:'BANO QUIMICO ALDI #35'},{codigo:'936',descripcion:'BANO QUIMICO DOSAL #36'},{codigo:'937',descripcion:'EQUIPO PODA NEUMATICA I #37'},{codigo:'938',descripcion:'MOTOBOMBA TOYAMA #38'},{codigo:'939',descripcion:'ABONADORA PARROTH #39'},{codigo:'940',descripcion:'APLICADOR PROTECSOL DOS #40'},{codigo:'941',descripcion:'BANO QUIMICO ALDI #41'},{codigo:'942',descripcion:'BANO QUIMICO DOSAL #42'},{codigo:'943',descripcion:'BANO QUIMICO DOSAL #43'},{codigo:'944',descripcion:'EQUIPO PODA NEUMATICA I #44'},{codigo:'945',descripcion:'COLOSO #45'},{codigo:'946',descripcion:'MAQUINA U #46'},{codigo:'947',descripcion:'ABONADORA PARROTH #47'},{codigo:'948',descripcion:'APLICADOR PROTECSOL DOS #48'},{codigo:'949',descripcion:'APLICADOR PROTECSOL DOS #49'},{codigo:'950',descripcion:'BBA DIESEL TOYOMA 4X4 #50'},{codigo:'951',descripcion:'BANO QUIMICO ALDI #51'},{codigo:'952',descripcion:'BANO QUIMICO DOSAL #52'},{codigo:'953',descripcion:'EQUIPO PODA NEUMATICA I #53'},{codigo:'954',descripcion:'TRACTO ELEVADOR #54'},{codigo:'955',descripcion:'ABONADORA PARROTH #55'},{codigo:'956',descripcion:'APLICADOR PROTECSOL DOS #56'},{codigo:'957',descripcion:'BANO QUIMICO AGRICOLA #57'},{codigo:'958',descripcion:'BANO QUIMICO DOSAL #58'},{codigo:'959',descripcion:'BANO QUIMICO DOSAL #59'},{codigo:'960',descripcion:'AZUFRADORA DOSAL #60'},{codigo:'961',descripcion:'BANO QUIMICO ALDI #61'},{codigo:'962',descripcion:'BANO QUIMICO ALDI #62'},{codigo:'963',descripcion:'EQUIPO PODA NEUMATICA #63'},{codigo:'964',descripcion:'EQUIPO PODA NEUMATICA #64'},{codigo:'965',descripcion:'RASTRA BALDAN #65'},{codigo:'966',descripcion:'COLOSO #66'},{codigo:'967',descripcion:'ARADO SUBSOLADOR #67'},{codigo:'968',descripcion:'TRACTO ELEVADOR #68'},{codigo:'969',descripcion:'RASTRA BALDAN #69'},{codigo:'970',descripcion:'APLICADOR PROTECSOL #70'},{codigo:'971',descripcion:'BANO QUIMICO SIN MARCA #71'},{codigo:'972',descripcion:'TRAILLA ZABRAN #72'},{codigo:'973',descripcion:'APLICADOR PROTECSOL DOS #73'},{codigo:'974',descripcion:'ABONADOR MASTER 2500 PI #74'},{codigo:'975',descripcion:'DESMALEZADORA FS 250 #75'},{codigo:'976',descripcion:'DESMALEZADORA FS 250C/T #76'},{codigo:'977',descripcion:'DESMALEZADORA FS 250C/T #77'},{codigo:'978',descripcion:'DESMALEZADORA FS 250C/T #78'},{codigo:'979',descripcion:'DESMALEZADORA FS 250 #79'},{codigo:'980',descripcion:'ARADO CINCEL DOSAL #80'},{codigo:'981',descripcion:'BANO QUIMICO #81'},{codigo:'982',descripcion:'ARADO CINCEL DOSAL #82'},{codigo:'983',descripcion:'ARADO CINCEL DOSAL #83'},{codigo:'984',descripcion:'APLICADOR MAT ORGANICA #84'},{codigo:'985',descripcion:'COLOSO #85'},{codigo:'986',descripcion:'COLOSO #86'},{codigo:'987',descripcion:'COLOSO #87'},{codigo:'988',descripcion:'DESBROZAORA/ORILLADORA #88'},{codigo:'989',descripcion:'ARADO RUEDA ACEQUIADORA #89'},{codigo:'990',descripcion:'MAQUNARIA arriendo #90'},{codigo:'991',descripcion:'HIDROLAVADORA PORTOTECN #91'},{codigo:'992',descripcion:'JYMPA DOSAL 2015 #92'},{codigo:'993',descripcion:'JYMPA DOSAL #93'},{codigo:'994',descripcion:'ARADO 4 DISCOS 61 #94'},{codigo:'995',descripcion:'MULA #95'},{codigo:'996',descripcion:'CARRO CISTERNA #96'},{codigo:'997',descripcion:'RODILLO COMPACTADOR #97'},{codigo:'998',descripcion:'RASTRA DOSAL 16 DISCOS #98'},{codigo:'999',descripcion:'CARRO ARRASTRE JE 9139 #99'},{codigo:'1000',descripcion:'CAMIONETA PHKT-15 JARDINERO'}];

function normalizeCentrosCosto(list) {
  if (!Array.isArray(list)) return [...defaultCentrosCosto];
  const seen = new Set();
  return list
    .map(item => ({
      nombre: String((item && item.nombre) || '').trim().toUpperCase(),
      numero: String((item && item.numero) || '').trim()
    }))
    .filter(item => item.nombre)
    .filter(item => {
      if (seen.has(item.nombre)) return false;
      seen.add(item.nombre);
      return true;
    });
}

function loadCentrosCosto() {
  const stored = localStorage.getItem(CENTROS_COSTO_KEY);
  if (stored) {
    try { return normalizeCentrosCosto(JSON.parse(stored)); } catch { return [...defaultCentrosCosto]; }
  }

  // Migración: unificar los catálogos antiguos de Emisores y Destinos en
  // un único catálogo de Centros de trabajo, conservando nombres únicos.
  const oldEmisores = localStorage.getItem(EMISORES_KEY);
  const oldDestinos = localStorage.getItem(DESTINOS_KEY);
  if (oldEmisores || oldDestinos) {
    let names = [];
    try { if (oldEmisores) names = names.concat(JSON.parse(oldEmisores)); } catch {}
    try { if (oldDestinos) names = names.concat(JSON.parse(oldDestinos)); } catch {}
    const seen = new Set();
    const merged = [];
    names.forEach(n => {
      const nombre = String(n || '').trim().toUpperCase();
      if (!nombre || seen.has(nombre)) return;
      seen.add(nombre);
      merged.push({ nombre, numero: `CC-${String(merged.length + 1).padStart(3, '0')}` });
    });
    const result = merged.length ? merged : [...defaultCentrosCosto];
    localStorage.setItem(CENTROS_COSTO_KEY, JSON.stringify(result));
    return result;
  }

  localStorage.setItem(CENTROS_COSTO_KEY, JSON.stringify(defaultCentrosCosto));
  return [...defaultCentrosCosto];
}

function saveCentrosCosto(list) {
  localStorage.setItem(CENTROS_COSTO_KEY, JSON.stringify(list));
  pushCentrosCostoToSupabase(list);
}

function loadChoferes() {
  const stored = localStorage.getItem(CHOFERES_KEY);
  if (!stored) {
    localStorage.setItem(CHOFERES_KEY, JSON.stringify(defaultChoferes));
    return defaultChoferes;
  }
  try {
    return normalizeDrivers(JSON.parse(stored));
  } catch {
    return defaultChoferes;
  }
}
function saveChoferes(list) {
  localStorage.setItem(CHOFERES_KEY, JSON.stringify(list));
  pushChoferesToSupabase(list);
}

function normalizeDrivers(list) {
  if (!Array.isArray(list)) return defaultChoferes;
  const seen = new Set();
  return list
    .map(item => {
      if (typeof item === 'string') {
        const [firstName = '', ...rest] = item.trim().split(/\s+/);
        return { firstName, lastName: rest.join(' ') };
      }
      return {
        firstName: String(item.firstName || '').trim(),
        lastName: String(item.lastName || '').trim()
      };
    })
    .filter(item => item.firstName || item.lastName)
    .filter(item => {
      const key = driverLabel(item).toUpperCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
}

function driverLabel(driver) {
  return `${driver.firstName || ''} ${driver.lastName || ''}`.trim();
}

function extractPlateFromDriverValue(value) {
  const match = String(value || '').match(/\(([A-Z0-9-]+)\)\s*$/i);
  return match ? match[1].toUpperCase() : '';
}

function cleanDriverValue(value) {
  return String(value || '').replace(/\s*\([A-Z0-9-]+\)\s*$/i, '').trim();
}

function loadVehiculos() {
  const stored = localStorage.getItem(VEHICULOS_KEY);
  if (stored) {
    try { return normalizeVehicles(JSON.parse(stored)); } catch { return normalizeVehicles(defaultVehiculos); }
  }

  const oldDrivers = localStorage.getItem(CHOFERES_KEY);
  const plates = [...defaultVehiculos];
  if (oldDrivers) {
    try {
      JSON.parse(oldDrivers).forEach(item => {
        if (item && item.plate) plates.push(item.plate);
      });
    } catch {}
  }
  const vehicles = normalizeVehicles(plates);
  localStorage.setItem(VEHICULOS_KEY, JSON.stringify(vehicles));
  return vehicles;
}

function saveVehiculos(list) {
  localStorage.setItem(VEHICULOS_KEY, JSON.stringify(list));
  pushVehiculosToSupabase(list);
}

function normalizeVehicles(list) {
  if (!Array.isArray(list)) list = defaultVehiculos;
  const map = new Map();
  list.forEach(item => {
    const raw = typeof item === 'string' ? { plate: item } : (item || {});
    const plate = String(raw.plate || '').trim().toUpperCase();
    if (!plate) return;
    map.set(plate, {
      plate,
      marca: String(raw.marca || '').trim().toUpperCase(),
      tipo: String(raw.tipo || '').trim().toUpperCase(),
      color: String(raw.color || '').trim().toUpperCase(),
    });
  });
  return [...map.values()].sort((a, b) => a.plate.localeCompare(b.plate, 'es'));
}

// El código puede venir como número o texto (según el Excel); se normaliza a
// texto para usarlo como clave estable, evitando duplicados por tipo.
function normalizeMaquinaria(list) {
  if (!Array.isArray(list)) return [...defaultMaquinaria];
  const seen = new Set();
  const result = [];
  list.forEach(item => {
    const codigo = String((item && item.codigo) ?? '').trim();
    const descripcion = String((item && item.descripcion) || '').replace(/\s+/g, ' ').trim();
    if (!codigo && !descripcion) return;
    const key = codigo || descripcion;
    if (seen.has(key)) return;
    seen.add(key);
    result.push({ codigo, descripcion });
  });
  return result;
}

function loadMaquinaria() {
  const stored = localStorage.getItem(MAQUINARIA_KEY);
  if (stored) {
    try { return normalizeMaquinaria(JSON.parse(stored)); } catch { return normalizeMaquinaria(defaultMaquinaria); }
  }
  localStorage.setItem(MAQUINARIA_KEY, JSON.stringify(defaultMaquinaria));
  return normalizeMaquinaria(defaultMaquinaria);
}

function saveMaquinaria(list) {
  localStorage.setItem(MAQUINARIA_KEY, JSON.stringify(list));
  pushMaquinariaToSupabase(list);
}

// Descarga el estado real desde Supabase (si está configurado) antes de que
// el resto de la app inicialice sus datos. "await" a nivel superior solo
// funciona porque app.js se carga como <script type="module"> en index.html.
await bootstrapFromSupabase();

let centrosCosto = loadCentrosCosto();
let choferes = loadChoferes();
let vehiculos = loadVehiculos();
let maquinaria = loadMaquinaria();
let movements = loadMovements();
let users = loadUsers();
let currentUser = loadSession();
let editingGuide = null;
let editingUsername = null;

// Core Users Database Access
function loadUsers() {
  const stored = localStorage.getItem(USERS_STORAGE_KEY);
  if (!stored) return { ...DEFAULT_USERS };
  try {
    const parsed = JSON.parse(stored);
    // Migración de usuarios antiguos para soportar el nuevo esquema
    Object.keys(DEFAULT_USERS).forEach(k => {
      if (parsed[k] && !parsed[k].firstName) {
        parsed[k] = { ...DEFAULT_USERS[k], ...parsed[k] };
      }
    });
    if (!parsed.admin) {
      parsed.admin = DEFAULT_USERS.admin;
    }
    // Migración: todo usuario debe quedar asociado a un único Centro de trabajo.
    // Los usuarios antiguos tenían campos separados "emisorAsignado" /
    // "destinoAsignado" (o un campo legado "area"); se intenta mapear ese
    // valor contra el catálogo unificado y, si no calza, se asigna el
    // primer centro de trabajo disponible.
    const centroNames = centrosCosto.map(c => c.nombre);
    Object.values(parsed).forEach(u => {
      if (!u.centroCostoAsignado) {
        const legacyValue = (u.destinoAsignado || u.emisorAsignado || u.area || '').trim().toUpperCase();
        const matched = centroNames.find(n => n === legacyValue);
        u.centroCostoAsignado = matched || centroNames[0] || '';
      }
      delete u.emisorAsignado;
      delete u.destinoAsignado;
      delete u.area;
    });
    return parsed;
  } catch {
    return { ...DEFAULT_USERS };
  }
}

function saveUsers() {
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  pushUsuariosToSupabase(users);
}

// Core Session Logic
// Se usa sessionStorage (no localStorage) a propósito: sessionStorage se
// borra automáticamente cuando se cierra la pestaña/ventana del navegador,
// así la sesión no queda abierta indefinidamente en el dispositivo.
function loadSession() {
  const stored = sessionStorage.getItem(SESSION_KEY);
  if (!stored) return null;
  try {
    const user = JSON.parse(stored);
    return users[user.username] ? users[user.username] : null;
  } catch {
    return null;
  }
}

function saveSession(user) {
  if (user) {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify({ username: user.username }));
  } else {
    sessionStorage.removeItem(SESSION_KEY);
  }
}

function updateSessionUI() {
  if (currentUser) {
    dom.loginOverlay.style.display = 'none';
    const fullName = `${currentUser.firstName || ''} ${currentUser.lastName || ''}`.trim() || currentUser.name || 'Sin nombre';
    dom.sessionUsername.textContent = fullName;
    dom.sessionRole.textContent = currentUser.role;
    dom.userAvatar.textContent = currentUser.username.charAt(0).toUpperCase();

    // Actualizar la información del perfil del usuario
    renderProfile();

    const isAdmin = currentUser.role === 'Administrador';
    
    // Toggle formularios del administrador en las vistas de catálogos
    const centroForm = document.querySelector('#centroCostoAdminForm');
    const drForm = document.querySelector('#driverAdminForm');
    const vehForm = document.querySelector('#vehicleAdminForm');
    const maquinariaForm = document.querySelector('#maquinariaAdminForm');
    const openChoferBtn = document.querySelector('#openChoferForm');
    const openVehicleBtn = document.querySelector('#openVehicleForm');
    if (centroForm) centroForm.style.display = isAdmin ? 'block' : 'none';
    if (drForm) drForm.style.display = isAdmin ? 'block' : 'none';
    if (vehForm) vehForm.style.display = isAdmin ? 'block' : 'none';
    if (maquinariaForm) maquinariaForm.style.display = isAdmin ? 'block' : 'none';
    if (openChoferBtn) openChoferBtn.style.display = isAdmin ? 'inline-flex' : 'none';
    if (openVehicleBtn) openVehicleBtn.style.display = isAdmin ? 'inline-flex' : 'none';

    // Toggle actions column dynamic visibility & Users Tab Access
    // RN-04: la columna Acciones se oculta por completo (no solo se
    // deshabilita) para cualquier usuario sin permisos de modificación, en
    // las vistas Movimientos, Centros de trabajo, Choferes, Vehículos y Maquinaria.
    const actionTables = [dom.movementsTable, document.querySelector('#centroCostoTable'), document.querySelector('#choferTable'), document.querySelector('#vehiculoTable'), document.querySelector('#maquinariaTable')];
    const dashboardFiltersEl = document.querySelector('#dashboardFilters');
    const metricsGridEl = document.querySelector('#metricsGrid');
    const homeAlertsSectionEl = document.querySelector('#homeAlertsSection');
    const homeViewTableBtnEl = document.querySelector('#homeViewTableBtn');
    const homeContentGridEl = document.querySelector('#homeContentGrid');

    if (isAdmin) {
      actionTables.forEach(t => t && t.classList.add('show-actions'));
      dom.navUsers.style.display = 'grid'; // Flex/Grid layout inside sidebar
      renderUsers();
      renderRecoveryAudit();
      // MEJORA 2 y 4: acciones rápidas + badge de auditoría, solo Administrador.
      if (dom.adminQuickActions) dom.adminQuickActions.style.display = 'flex';
      renderPasswordAuditBadge();

      // Vista Home del Administrador: sin cambios (filtros, métricas,
      // alertas y botón "Ver tabla" siguen visibles).
      if (dashboardFiltersEl) dashboardFiltersEl.style.display = '';
      if (metricsGridEl) metricsGridEl.style.display = '';
      if (homeAlertsSectionEl) homeAlertsSectionEl.style.display = '';
      if (homeViewTableBtnEl) homeViewTableBtnEl.style.display = '';
      if (homeContentGridEl) homeContentGridEl.classList.remove('single-column');
    } else {
      actionTables.forEach(t => t && t.classList.remove('show-actions'));
      dom.navUsers.style.display = 'none';
      if (dom.adminQuickActions) dom.adminQuickActions.style.display = 'none';

      // Vista Home de cuentas de Usuario: simplificada, solo bienvenida +
      // últimos movimientos de su centro de trabajo.
      if (dashboardFiltersEl) dashboardFiltersEl.style.display = 'none';
      if (metricsGridEl) metricsGridEl.style.display = 'none';
      if (homeAlertsSectionEl) homeAlertsSectionEl.style.display = 'none';
      if (homeViewTableBtnEl) homeViewTableBtnEl.style.display = 'none';
      if (homeContentGridEl) homeContentGridEl.classList.add('single-column');

      // Prevent access to users tab if logged out or demoted
      const activeTab = document.querySelector('.nav-item.active');
      if (activeTab && activeTab.dataset.view === 'users') {
        switchView('dashboard');
      }
    }
  } else {
    dom.loginOverlay.style.display = 'flex';
    dom.loginUsername.value = '';
    dom.loginPassword.value = '';
    dom.loginError.hidden = true;
    [dom.movementsTable, document.querySelector('#centroCostoTable'), document.querySelector('#choferTable'), document.querySelector('#vehiculoTable'), document.querySelector('#maquinariaTable')].forEach(t => t && t.classList.remove('show-actions'));
    dom.navUsers.style.display = 'none';
    if (dom.adminQuickActions) dom.adminQuickActions.style.display = 'none';
    // Ocultar formulario de recuperación al cerrar sesión / resetear
    if (dom.recoveryForm) {
      dom.recoveryForm.style.display = 'none';
      dom.loginForm.style.display = 'grid';
      dom.loginCardTitle.textContent = '¡Hola!';
      dom.loginCardSubtitle.textContent = 'Inicia sesión para registrar movimientos';
      dom.recoveryInput.value = '';
      dom.recoveryMessage.hidden = true;
    }
  }
}

// ============================================================
// CONTROL DE INACTIVIDAD DE SESIÓN
// ============================================================
// A los 30 minutos sin actividad del usuario (mouse, teclado, clics,
// scroll o toques), se muestra una advertencia con 60 segundos para
// decidir si continuar conectado; si no responde, la sesión se cierra sola.
const INACTIVITY_LIMIT_MS = 30 * 60 * 1000; // 30 minutos
const INACTIVITY_WARNING_SECONDS = 60;

let inactivityTimeoutId = null;
let inactivityCountdownIntervalId = null;
let inactivityWarningVisible = false;

const INACTIVITY_ACTIVITY_EVENTS = ['mousemove', 'mousedown', 'keydown', 'scroll', 'touchstart', 'click'];

function handleUserActivityForInactivity() {
  if (inactivityWarningVisible) return; // Mientras se muestra la advertencia, solo cuenta el botón.
  resetInactivityTimer();
}

function resetInactivityTimer() {
  if (inactivityTimeoutId) clearTimeout(inactivityTimeoutId);
  inactivityTimeoutId = setTimeout(showInactivityWarning, INACTIVITY_LIMIT_MS);
}

function startInactivityMonitor() {
  INACTIVITY_ACTIVITY_EVENTS.forEach(evt => window.addEventListener(evt, handleUserActivityForInactivity, { passive: true }));
  resetInactivityTimer();
}

function stopInactivityMonitor() {
  INACTIVITY_ACTIVITY_EVENTS.forEach(evt => window.removeEventListener(evt, handleUserActivityForInactivity));
  if (inactivityTimeoutId) clearTimeout(inactivityTimeoutId);
  if (inactivityCountdownIntervalId) clearInterval(inactivityCountdownIntervalId);
  inactivityTimeoutId = null;
  inactivityCountdownIntervalId = null;
  inactivityWarningVisible = false;
  if (dom.inactivityOverlay) dom.inactivityOverlay.style.display = 'none';
}

function showInactivityWarning() {
  if (!currentUser) return;
  inactivityWarningVisible = true;
  let secondsLeft = INACTIVITY_WARNING_SECONDS;
  if (dom.inactivityCountdown) dom.inactivityCountdown.textContent = secondsLeft;
  if (dom.inactivityOverlay) dom.inactivityOverlay.style.display = 'flex';

  inactivityCountdownIntervalId = setInterval(() => {
    secondsLeft -= 1;
    if (dom.inactivityCountdown) dom.inactivityCountdown.textContent = Math.max(secondsLeft, 0);
    if (secondsLeft <= 0) {
      clearInterval(inactivityCountdownIntervalId);
      inactivityCountdownIntervalId = null;
      inactivityWarningVisible = false;
      if (dom.inactivityOverlay) dom.inactivityOverlay.style.display = 'none';
      handleLogout();
    }
  }, 1000);
}

function handleInactivityContinue() {
  inactivityWarningVisible = false;
  if (inactivityCountdownIntervalId) clearInterval(inactivityCountdownIntervalId);
  if (dom.inactivityOverlay) dom.inactivityOverlay.style.display = 'none';
  resetInactivityTimer();
}

function handleInactivityLogoutNow() {
  inactivityWarningVisible = false;
  if (inactivityCountdownIntervalId) clearInterval(inactivityCountdownIntervalId);
  if (dom.inactivityOverlay) dom.inactivityOverlay.style.display = 'none';
  handleLogout();
}

if (dom.inactivityContinueBtn) dom.inactivityContinueBtn.addEventListener('click', handleInactivityContinue);
if (dom.inactivityLogoutBtn) dom.inactivityLogoutBtn.addEventListener('click', handleInactivityLogoutNow);

function handleLogin(event) {
  event.preventDefault(); // Evita que la página se recargue

  const loginInput = dom.loginUsername.value.trim().toLowerCase();
  const passwordInput = dom.loginPassword.value;

  // Buscar por nombre de usuario o por correo corporativo
  const user = Object.values(users).find(u => 
    u.username.toLowerCase() === loginInput || 
    (u.email && u.email.toLowerCase() === loginInput)
  );

  if (user && user.pass === passwordInput) {
    currentUser = user;
    saveSession(currentUser); 
    updateSessionUI();
    switchView('dashboard');
    renderAll();
    startInactivityMonitor();
  } else {
    if (dom.loginError) {
      dom.loginError.hidden = false;
      dom.loginError.textContent = 'Usuario/correo o contraseña incorrectos.';
    }
  }
}

function handleLogout() {
  currentUser = null;
  saveSession(null);
  updateSessionUI();
  renderAll();
  stopInactivityMonitor();
}

// Movements Data Access
function loadMovements() {
  const stored = localStorage.getItem(STORAGE_KEY);
  let parsed = seedMovements;
  if (stored) {
    try {
      const temp = JSON.parse(stored);
      if (Array.isArray(temp)) parsed = temp;
    } catch {}
  }
  
  // Asignar IDs de registro numéricos únicos si faltan (migración)
  let maxId = 0;
  parsed.forEach(m => {
    if (m.id && typeof m.id === 'number' && m.id > maxId) maxId = m.id;
  });
  
  let needsSave = false;
  parsed.forEach(m => {
    if (!m.id) {
      maxId++;
      m.id = maxId;
      needsSave = true;
    }
    if (!m.vehiclePlate) {
      const plate = extractPlateFromDriverValue(m.driver);
      if (plate) {
        m.vehiclePlate = plate;
        m.driver = cleanDriverValue(m.driver);
        needsSave = true;
      }
    }
  });
  
  if (needsSave) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
  }
  return parsed;
}

function saveMovements() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(movements));
  pushMovementsToSupabase(movements);
}

const VERIFICATION_STATES = ['Pendiente', 'Verificado', 'No verificado'];

// Traduce cualquier valor histórico (√, ×, v, x, vacío) o ya migrado al
// nuevo enumerado textual de tres estados: Pendiente / Verificado / No verificado.
function normalizeVerification(value) {
  const raw = String(value || '').trim();
  if (VERIFICATION_STATES.includes(raw)) return raw;
  const normalized = raw.toLowerCase();
  if (['√', 'v', 'ok', 'si', 'sí', 'verificado'].includes(normalized)) return 'Verificado';
  if (['×', 'x', 'no', 'no verificado', 'rechazado'].includes(normalized)) return 'No verificado';
  return 'Pendiente';
}

function getStatus(movement) {
  const verification = normalizeVerification(movement.verification);
  if (verification === 'Pendiente') return 'Sin verificar';
  if (verification === 'No verificado') return 'No verificado';
  if (movement.destination.toUpperCase() === 'TALLER') return 'En Taller';
  if (movement.sender.toUpperCase() === 'TALLER') return 'En Huerto';
  return 'Verificado';
}

function statusClass(status) {
  return {
    'En Taller': 'status-workshop',
    'En Huerto': 'status-field',
    'Sin verificar': 'status-pending',
    'No verificado': 'status-rejected',
    'Verificado': 'status-ok'
  }[status] || 'status-ok';
}

// Devuelve "Nombre Apellido" del usuario indicado; si el usuario ya no
// existe o no tiene nombre cargado, cae de vuelta al nombre de usuario.
function getUserFullName(username) {
  if (!username) return 'sistema';
  const user = users[username];
  if (!user) return username;
  const fullName = `${user.firstName || ''} ${user.lastName || ''}`.trim();
  return fullName || user.username;
}

function formatDate(value) {
  if (!value) return '';
  const [year, month, day] = value.split('-');
  return `${day}-${month}-${year}`;
}

// Fecha local de hoy en formato YYYY-MM-DD (evita desfases de zona horaria).
function todayISODate() {
  const localDate = new Date();
  const offset = localDate.getTimezoneOffset();
  return new Date(localDate.getTime() - (offset * 60 * 1000)).toISOString().split('T')[0];
}

function getReceptionStatus(m) {
  const verification = normalizeVerification(m.verification);
  if (verification === 'Verificado') return 'Recepcionado';
  if (verification === 'No verificado') return 'No recepcionado';
  return 'Pendiente';
}

function receptionClass(status) {
  return {
    'Recepcionado': 'status-field',
    'No recepcionado': 'status-pending',
    'Pendiente': 'status-workshop'
  }[status] || 'status-workshop';
}

// La cuenta Administrador tiene acceso completo a las notas de todos los movimientos.
// Un usuario perteneciente a un Destino puede leer las notas de los movimientos
// emitidos o recibidos por dicho Destino. El usuario que registró el movimiento
// también puede leer su propia nota.
function canReadNote(m) {
  if (!currentUser) return false;
  if (currentUser.role === 'Administrador') return true;
  if (currentUser.username === m.createdBy) return true;
  const centro = (currentUser.centroCostoAsignado || '').toUpperCase();
  if (centro && m.sender && centro === m.sender.toUpperCase()) return true;
  if (centro && m.destination && centro === m.destination.toUpperCase()) return true;
  return false;
}

// La verificación de un movimiento solo puede realizarla el usuario cuyo
// Centro de trabajo corresponde al Destino de ese movimiento (o un
// Administrador). El usuario que emitió el movimiento no puede verificar su
// propio envío (evita autoverificación), salvo cuando el centro de trabajo
// emisor y el de destino son el mismo (movimiento interno), caso en el que
// no existe una contraparte distinta que deba validarlo.
function canVerifyMovement(m) {
  if (!currentUser || !m) return false;
  if (currentUser.role === 'Administrador') return true;
  const centro = (currentUser.centroCostoAsignado || '').toUpperCase();
  const isDestinationCentro = !!centro && !!m.destination && centro === m.destination.toUpperCase();
  if (!isDestinationCentro) return false;
  if (currentUser.username === m.createdBy) {
    const sameCentro = !!m.sender && !!m.destination && m.sender.toUpperCase() === m.destination.toUpperCase();
    return sameCentro;
  }
  return true;
}

// Movimientos de "carga inicial" (sembrados para fijar la ubicación de
// partida de cada máquina antes de que existieran movimientos reales).
// Se identifican por guide === 'INV-INICIAL'. Deben seguir contando para
// el cálculo de ubicación (computeMachineLocations) y para el detector de
// maquinaria crítica en Taller (getMachinesCriticallyInWorkshop), pero NO
// deben aparecer como filas visibles en ninguna pantalla ni exportación.
function isSeedMovement(m) {
  return String(m && m.guide) === 'INV-INICIAL';
}

function visibleMovements() {
  return movements.filter(m => !isSeedMovement(m));
}

// Unique fields collector
function uniqueValues(fields) {
  const values = new Set();
  movements.forEach(m => fields.forEach(f => {
    const v = String(m[f] || '').trim();
    if (v) values.add(v);
  }));
  return [...values].sort((a, b) => a.localeCompare(b, 'es'));
}

// MEJORA 1: mantiene sincronizado el <select> de Ubicación del Dashboard con
// el catálogo de Centros de trabajo, preservando la opción actualmente elegida
// por el usuario (no se resetea en cada renderAll()).
function populateDashboardLocationFilter() {
  if (!dom.dashboardLocationFilter) return;
  const current = dom.dashboardLocationFilter.value;
  const options = ['<option value="">Todas las ubicaciones</option>']
    .concat(centrosCosto.map(c => `<option value="${c.nombre}">${c.nombre}</option>`));
  dom.dashboardLocationFilter.innerHTML = options.join('');
  if (current && centrosCosto.some(c => c.nombre === current)) {
    dom.dashboardLocationFilter.value = current;
  }
}

// MEJORA 1: aplica los filtros de Periodo (Histórico / Este mes / Esta
// semana) y Ubicación (Centro de trabajo, comparado contra Emisor o Destino)
// sobre el array `movements`, sin mutarlo.
function getDashboardFilteredMovements() {
  const period = dom.dashboardPeriodFilter ? dom.dashboardPeriodFilter.value : 'historico';
  const location = dom.dashboardLocationFilter ? dom.dashboardLocationFilter.value : '';
  const today = todayISODate();

  return visibleMovements().filter(m => {
    if (location && m.sender !== location && m.destination !== location) return false;

    if (period === 'semana') {
      // "Esta semana" = ventana móvil de los últimos 7 días (incluye hoy).
      const diffDays = (new Date(today) - new Date(m.date)) / 86400000;
      if (!(diffDays >= 0 && diffDays < 7)) return false;
    } else if (period === 'mes') {
      // "Este mes" = mismo año-mes calendario que la fecha actual del sistema.
      if (String(m.date).slice(0, 7) !== today.slice(0, 7)) return false;
    }
    // 'historico' (o cualquier otro valor): sin filtro de fecha.
    return true;
  });
}

function renderMetrics() {
  populateDashboardLocationFilter();

  // Métricas "Movimientos", "En Taller" y "Sin verificar" se recalculan según
  // los filtros de Periodo/Ubicación del Dashboard.
  const filtered = getDashboardFilteredMovements();
  const total = filtered.length;
  const inWorkshop = filtered.filter(i => getStatus(i) === 'En Taller').length;
  const pending = filtered.filter(i => getStatus(i) === 'Sin verificar').length;

  // La métrica de "Maquinaria" permanece fija: es el tamaño del catálogo
  // completo, no depende de los filtros del Dashboard.
  const machines = uniqueValues(['machine']).length;

  const metrics = [
    ['Movimientos', total, 'registros totales'],
    ['En Taller', inWorkshop, 'requieren seguimiento'],
    ['Sin verificar', pending, 'validación pendiente'],
    ['Maquinaria', machines, 'equipos registrados']
  ];
  dom.metricsGrid.innerHTML = metrics.map(([label, value, hint]) =>
    `<article class="metric-card"><span>${label}</span><strong>${value}</strong><small>${hint}</small></article>`
  ).join('');

  // MEJORA 4: badge de auditoría de recuperación de contraseñas (solo visible
  // para Administrador; la función se autoprotege si no aplica).
  renderPasswordAuditBadge();
}

function movementRow(m) {
  const status = getStatus(m);
  const verification = normalizeVerification(m.verification);
  const reception = getReceptionStatus(m);
  
  // Cargado por: se muestra el nombre y apellido del usuario que registró
  // el movimiento (no el nombre de usuario). No se muestran textos de
  // modificación en esta vista.
  const creatorName = getUserFullName(m.createdBy);
  const auditHtml = `<td>${creatorName}</td>`;

  // La columna Verificación es el único punto desde el cual se puede cambiar
  // el estado de un movimiento. El <select> se muestra siempre (para que
  // cualquier usuario vea el estado actual) pero solo queda habilitado para
  // quien tiene permiso de verificar ese movimiento puntual (canVerifyMovement).
  const canVerify = canVerifyMovement(m);
  const verifyClass = { 'Pendiente': 'status-pending', 'Verificado': 'status-ok', 'No verificado': 'status-rejected' }[verification] || 'status-pending';
  const verifySelect = `<select class="verify-select ${verifyClass}"
      onclick="event.stopPropagation()"
      onchange="event.stopPropagation();handleVerificationChange('${m.guide}', this.value, this)"
      ${canVerify ? '' : 'disabled title="No tiene permiso para verificar este movimiento"'}>
      ${VERIFICATION_STATES.map(s => `<option value="${s}" ${s === verification ? 'selected' : ''}>${s}</option>`).join('')}
    </select>`;

  // Acciones (Editar/Eliminar): visible únicamente para Administrador.
  // La verificación ya no se realiza desde aquí (ver columna Verificación).
  // El detalle del movimiento se abre haciendo clic en cualquier parte de
  // la fila (ver onclick del <tr> más abajo), por lo que ya no hace falta
  // un botón "Ver" separado, ni siquiera para el Administrador.
  const isAdmin = currentUser && currentUser.role === 'Administrador';
  const actionsHtml = isAdmin
    ? `<td class="action-cell action-column">
        <div class="action-btn-group">
          <button class="action-btn edit-btn" onclick="event.stopPropagation();openEditDrawer('${m.guide}')" type="button">Editar</button>
          <button class="action-btn delete-btn" onclick="event.stopPropagation();handleDelete('${m.guide}')" type="button">Eliminar</button>
        </div>
      </td>`
    : `<td class="action-column"></td>`;

  return `<tr onclick="openDetailDrawer('${m.guide}')" style="cursor:pointer;">
    <td class="id-column">#${String(m.id).padStart(4, '0')}</td>
    <td>${formatDate(m.date)}</td>
    <td>${m.docType || 'Guía'} ${m.guide}</td>
    <td class="machine-cell" title="${m.machine}">${m.machine}</td>
    <td>${m.sender}</td>
    <td>${m.destination}</td>
    <td>${m.driver}</td>
    <td>${m.vehiclePlate || '-'}</td>
    <td>${verifySelect}</td>
    <td><span class="status-pill ${receptionClass(reception)}">${reception}</span></td>
    ${auditHtml}
    ${actionsHtml}
  </tr>`;
}

function recentRow(m) {
  const status = getStatus(m);
  return `<tr>
    <td>#${String(m.id).padStart(4, '0')}</td>
    <td>${formatDate(m.date)}</td>
    <td>${m.docType || 'Guía'} ${m.guide}</td>
    <td class="machine-cell" title="${m.machine}">${m.machine}</td>
    <td>${m.sender}</td>
    <td>${m.destination}</td>
    <td><span class="status-pill ${statusClass(status)}">${status}</span></td>
  </tr>`;
}

function filteredMovements() {
  const query = dom.searchInput.value.trim().toLowerCase();
  const from = dom.fromDate.value;
  const to = dom.toDate.value;
  return visibleMovements()
    .filter(m => {
      // Filtrar la nota en la búsqueda para que no se filtre por palabras de notas ocultas
      const noteSearch = canReadNote(m) ? (m.note || '') : '';
      const haystack = [
        m.id,
        m.guide,
        m.machine,
        m.sender,
        m.destination,
        m.driver,
        m.vehiclePlate || '',
        noteSearch,
        m.createdBy || '',
        m.modifiedBy || ''
      ].join(' ').toLowerCase();
      return !query || haystack.includes(query);
    })
    .filter(m => !from || m.date >= from)
    .filter(m => !to || m.date <= to)
    .sort((a, b) => b.date.localeCompare(a.date) || (b.id - a.id));
}

function renderTables() {
  const rows = filteredMovements();
  dom.movementRows.innerHTML = rows.map(movementRow).join('');
  dom.resultCount.textContent = rows.length;

  // Vista Home: solo para cuentas de Usuario (no Administrador) se muestran
  // únicamente los movimientos de su propio centro de trabajo (como emisor o
  // destino). El Administrador sigue viendo los movimientos recientes de
  // todos los centros, sin cambios.
  const esAdministrador = currentUser && currentUser.role === 'Administrador';
  const miCentro = (!esAdministrador && currentUser && currentUser.centroCostoAsignado)
    ? currentUser.centroCostoAsignado.toUpperCase()
    : null;
  const recentTitleEl = document.querySelector('#recentMovementsTitle');
  let recentSource = visibleMovements();
  if (miCentro) {
    recentSource = recentSource.filter(m =>
      (m.sender || '').toUpperCase() === miCentro || (m.destination || '').toUpperCase() === miCentro
    );
    if (recentTitleEl) recentTitleEl.textContent = `Últimos movimientos de ${currentUser.centroCostoAsignado}`;
  } else if (recentTitleEl) {
    recentTitleEl.textContent = 'Últimos movimientos';
  }

  // Ahora que en el Home de Usuario esta lista queda sola (sin métricas ni
  // alertas), se muestran más filas ya que hay espacio disponible.
  const recentLimit = miCentro ? 15 : 8;

  dom.recentRows.innerHTML = [...recentSource]
    .sort((a, b) => b.date.localeCompare(a.date) || (b.id - a.id))
    .slice(0, recentLimit)
    .map(recentRow)
    .join('');
}

// MEJORA 3: detecta maquinaria cuyo último movimiento registrado tuvo como
// Destino "TALLER" y que, por lo tanto, no cuenta con un movimiento posterior
// de salida. Si ya lleva más de `thresholdDays` días ahí, se marca como
// crítica. Un movimiento puede incluir varios artículos de maquinaria (según
// el combobox de selección múltiple), por lo que cada artículo se rastrea
// por separado.
function getMachinesCriticallyInWorkshop(thresholdDays = 5) {
  const events = [];
  movements.forEach(m => {
    const items = String(m.machine || '').split(',').map(s => s.trim()).filter(Boolean);
    items.forEach(item => {
      events.push({ machine: item, date: m.date, destination: String(m.destination || '').toUpperCase(), id: m.id || 0 });
    });
  });

  // Última posición conocida de cada artículo de maquinaria (por fecha, y por
  // id de movimiento como desempate si dos movimientos comparten fecha).
  const lastByMachine = new Map();
  events.forEach(ev => {
    const prev = lastByMachine.get(ev.machine);
    if (!prev || ev.date > prev.date || (ev.date === prev.date && ev.id > prev.id)) {
      lastByMachine.set(ev.machine, ev);
    }
  });

  const today = new Date(todayISODate());
  const critical = [];
  lastByMachine.forEach(ev => {
    if (ev.destination !== 'TALLER') return;
    const days = Math.floor((today - new Date(ev.date)) / 86400000);
    if (days > thresholdDays) critical.push({ machine: ev.machine, date: ev.date, days });
  });
  return critical.sort((a, b) => b.days - a.days);
}

function renderAlerts() {
  const visible = visibleMovements();
  const pending = visible.filter(i => getStatus(i) === 'Sin verificar').length;
  const noNote = visible.filter(i => !String(i.note || '').trim()).length;
  const inWorkshop = visible.filter(i => getStatus(i) === 'En Taller').length;

  // MEJORA 3: alertas de tiempo crítico (maquinaria con más de 5 días en
  // Taller sin movimiento de salida posterior). Van primero y siempre en
  // rojo ('critical'), por delante de las alertas generales existentes.
  const criticalWorkshop = getMachinesCriticallyInWorkshop(5);
  const criticalAlertsHtml = criticalWorkshop.map(item => `
    <div class="alert-item critical">
      <strong>ALERTA: ${item.machine} lleva más de 5 días en Taller.</strong>
      <span>Ingresó el ${formatDate(item.date)} · ${item.days} días en Taller</span>
    </div>`).join('');

  const alerts = [
    ['Sin verificar', `${pending} movimientos pendientes`, pending > 0],
    ['En Taller', `${inWorkshop} equipos con destino taller`, inWorkshop > 0],
    ['Notas vacías', `${noNote} registros sin observación`, noNote > 0]
  ].filter(([, , active]) => active);

  const regularAlertsHtml = alerts.map(([title, detail], index) =>
    `<div class="alert-item ${index === 0 && !criticalWorkshop.length ? 'critical' : ''}"><strong>${title}</strong><span>${detail}</span></div>`
  ).join('');

  const finalHtml = criticalAlertsHtml + regularAlertsHtml;
  dom.alertList.innerHTML = finalHtml || '<div class="alert-item"><strong>Sin alertas</strong><span>Registros al día</span></div>';
}

// ─── Combobox de búsqueda reutilizable (selección única) ─────────────────────
// Usado por Emisor, Destino, Chofer y Patente: un input de texto filtra una
// lista de opciones: el valor real elegido queda en un input oculto (que es
// el que efectivamente viaja en el FormData del formulario, vía su atributo
// "name"), evitando que se pueda guardar texto libre que no exista en el
// catálogo correspondiente.
function createSearchableSelect({ searchInputId, hiddenInputId, listId, getOptions, emptyMessage }) {
  const state = { activeIndex: -1 };
  const getSearchInput = () => document.querySelector(`#${searchInputId}`);
  const getHiddenInput = () => document.querySelector(`#${hiddenInputId}`);
  const getList = () => document.querySelector(`#${listId}`);

  function renderOptions(query) {
    const list = getList();
    if (!list) return;
    state.activeIndex = -1;
    const options = getOptions();
    if (!options.length) {
      list.innerHTML = `<div class="combobox-empty">${emptyMessage}</div>`;
      return;
    }
    const q = String(query || '').trim().toLowerCase();
    const filtered = q ? options.filter(label => label.toLowerCase().includes(q)) : options;
    if (!filtered.length) {
      list.innerHTML = '<div class="combobox-empty">Sin coincidencias</div>';
      return;
    }
    list.innerHTML = filtered.map(label =>
      `<div class="combobox-option" role="option" data-value="${label.replace(/"/g, '&quot;')}">${label}</div>`
    ).join('');
  }

  function open() {
    const searchInput = getSearchInput();
    renderOptions(searchInput ? searchInput.value : '');
    const list = getList();
    if (list) list.hidden = false;
  }

  function close() {
    const list = getList();
    if (list) list.hidden = true;
    state.activeIndex = -1;
  }

  // Selecciona (o precarga, p. ej. al editar un movimiento) un valor puntual.
  function select(value) {
    const hiddenInput = getHiddenInput();
    const searchInput = getSearchInput();
    if (hiddenInput) hiddenInput.value = value || '';
    if (searchInput) searchInput.value = value || '';
    close();
  }

  function clear() {
    select('');
  }

  function highlight(options) {
    options.forEach((opt, i) => opt.classList.toggle('active', i === state.activeIndex));
    const active = options[state.activeIndex];
    if (active) active.scrollIntoView({ block: 'nearest' });
  }

  function handleKeydown(event) {
    const list = getList();
    if (!list) return;
    if (list.hidden) {
      if (event.key === 'ArrowDown' || event.key === 'Enter') { event.preventDefault(); open(); }
      return;
    }
    const options = Array.from(list.querySelectorAll('.combobox-option'));
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      if (options.length) { state.activeIndex = Math.min(state.activeIndex + 1, options.length - 1); highlight(options); }
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      if (options.length) { state.activeIndex = Math.max(state.activeIndex - 1, 0); highlight(options); }
    } else if (event.key === 'Enter') {
      if (state.activeIndex >= 0 && options[state.activeIndex]) { event.preventDefault(); select(options[state.activeIndex].dataset.value); }
    } else if (event.key === 'Escape') {
      close();
    }
  }

  // Vuelve a validar/refrescar tras un cambio de catálogo (p. ej. se agregó o
  // eliminó un Centro de trabajo, Chofer o Vehículo).
  function refresh() {
    const hiddenInput = getHiddenInput();
    const searchInput = getSearchInput();
    if (!hiddenInput) return;
    const options = getOptions();
    if (hiddenInput.value && !options.includes(hiddenInput.value)) {
      hiddenInput.value = '';
      if (searchInput) searchInput.value = '';
    }
    const list = getList();
    if (list && !list.hidden) renderOptions(searchInput ? searchInput.value : '');
  }

  const searchInput = getSearchInput();
  const list = getList();
  if (searchInput) {
    searchInput.addEventListener('focus', open);
    searchInput.addEventListener('input', open);
    searchInput.addEventListener('keydown', handleKeydown);
    searchInput.addEventListener('blur', () => setTimeout(close, 150));
  }
  if (list) {
    // mousedown (no click) para que dispare antes que el blur del input de búsqueda.
    list.addEventListener('mousedown', (event) => {
      const option = event.target.closest('.combobox-option');
      if (!option) return;
      event.preventDefault();
      select(option.dataset.value);
    });
  }

  return { select, clear, refresh, close };
}

const senderCombobox = createSearchableSelect({
  searchInputId: 'formSenderSearch',
  hiddenInputId: 'formSenderSelect',
  listId: 'formSenderList',
  getOptions: () => centrosCosto.map(c => c.nombre),
  emptyMessage: 'No hay centros de trabajo registrados'
});
const destinationCombobox = createSearchableSelect({
  searchInputId: 'formDestinationSearch',
  hiddenInputId: 'formDestinationSelect',
  listId: 'formDestinationList',
  getOptions: () => centrosCosto.map(c => c.nombre),
  emptyMessage: 'No hay centros de trabajo registrados'
});
const driverCombobox = createSearchableSelect({
  searchInputId: 'formDriverSearch',
  hiddenInputId: 'formDriverSelect',
  listId: 'formDriverList',
  getOptions: () => choferes.map(c => driverLabel(c)),
  emptyMessage: 'No hay choferes registrados'
});
const vehicleCombobox = createSearchableSelect({
  searchInputId: 'formVehicleSearch',
  hiddenInputId: 'formVehicleSelect',
  listId: 'formVehicleList',
  getOptions: () => vehiculos.map(v => v.plate),
  emptyMessage: 'No hay vehículos registrados'
});

// ─── Editing state per catalog ───────────────────────────────────────────────
let editingCentroCostoIndex = null;
let editingDriverIndex = null;
let editingVehicleIndex = null;
let editingMaquinariaIndex = null;

function renderCentrosCosto() {
  const count = document.querySelector('#centroCostoCount');
  const tbody = document.querySelector('#centroCostoRows');
  if (count) count.textContent = centrosCosto.length;
  if (tbody) {
    const isAdmin = currentUser && currentUser.role === 'Administrador';
    tbody.innerHTML = centrosCosto.map((c, idx) => `
      <tr>
        <td>${idx + 1}</td>
        <td>${c.numero || '-'}</td>
        <td>${c.nombre}</td>
        <td class="action-column">
          ${isAdmin ? `<div class="action-btn-group">
            <button class="action-btn edit-btn" onclick="startEditCentroCosto(${idx})" type="button">Editar</button>
            <button class="action-btn delete-btn" onclick="handleDeleteCatalogItem('centroCosto','${c.nombre}')" type="button">Eliminar</button>
          </div>` : '-'}
        </td>
      </tr>`).join('');
  }
  // El centro de trabajo actúa dinámicamente como Emisor o Destino según el
  // movimiento, por lo que ambos combobox del formulario comparten el mismo
  // catálogo unificado.
  senderCombobox.refresh();
  destinationCombobox.refresh();
}

function renderChoferes() {
  const count = document.querySelector('#driverCount');
  const tbody = document.querySelector('#driverRows');
  if (count) count.textContent = choferes.length;
  if (!tbody) return;
  const isAdmin = currentUser && currentUser.role === 'Administrador';
  tbody.innerHTML = choferes.map((c, idx) => {
    const label = driverLabel(c);
    return `<tr>
      <td>${idx + 1}</td>
      <td>${c.firstName}</td>
      <td>${c.lastName}</td>
      <td class="action-column">
        ${isAdmin ? `<div class="action-btn-group">
          <button class="action-btn edit-btn" onclick="startEditDriver(${idx})" type="button">Editar</button>
          <button class="action-btn delete-btn" onclick="handleDeleteCatalogItem('chofer','${label}')" type="button">Eliminar</button>
        </div>` : '-'}
      </td>
    </tr>`;
  }).join('');
  driverCombobox.refresh();
}

function renderVehiculos() {
  const count = document.querySelector('#vehicleCount');
  const tbody = document.querySelector('#vehicleRows');
  if (count) count.textContent = vehiculos.length;
  if (!tbody) return;
  const isAdmin = currentUser && currentUser.role === 'Administrador';
  tbody.innerHTML = vehiculos.map((v, idx) => `
    <tr>
      <td>${idx + 1}</td>
      <td>${v.marca || '-'}</td>
      <td>${v.plate}</td>
      <td>${v.tipo || '-'}</td>
      <td>${v.color || '-'}</td>
      <td class="action-column">
        ${isAdmin ? `<div class="action-btn-group">
          <button class="action-btn edit-btn" onclick="startEditVehicle(${idx})" type="button">Editar</button>
          <button class="action-btn delete-btn" onclick="handleDeleteCatalogItem('vehiculo','${v.plate}')" type="button">Eliminar</button>
        </div>` : '-'}
      </td>
    </tr>`).join('');
  vehicleCombobox.refresh();
}

// Etiqueta mostrada tanto en el catálogo como en el <select> del formulario
// de movimientos: "{código} - {descripción}".
function maquinariaLabel(item) {
  return item.codigo ? `${item.codigo} - ${item.descripcion}` : item.descripcion;
}

function renderMaquinaria() {
  const count = document.querySelector('#maquinariaCount');
  const tbody = document.querySelector('#maquinariaRows');
  if (count) count.textContent = maquinaria.length;
  if (tbody) {
    const isAdmin = currentUser && currentUser.role === 'Administrador';
    tbody.innerHTML = maquinaria.map((item, idx) => `
      <tr>
        <td>${idx + 1}</td>
        <td>${item.codigo || '-'}</td>
        <td>${item.descripcion}</td>
        <td class="action-column">
          ${isAdmin ? `<div class="action-btn-group">
            <button class="action-btn edit-btn" onclick="startEditMaquinaria(${idx})" type="button">Editar</button>
            <button class="action-btn delete-btn" onclick="handleDeleteCatalogItem('maquinaria','${item.codigo || item.descripcion}')" type="button">Eliminar</button>
          </div>` : '-'}
        </td>
      </tr>`).join('');
  }
  // El campo Maquinaria del formulario "Nuevo movimiento" es un combobox con
  // filtro de texto que se alimenta de este mismo catálogo (ver más abajo).
  refreshMachineCombobox();
}

const MAX_MACHINES = 5;
let selectedMachines = [];
let machineListActiveIndex = -1;

function getMachineOptionLabels() {
  return maquinaria.map(item => maquinariaLabel(item));
}

// Vuelve a validar la selección actual contra el catálogo (por si cambió,
// p. ej. tras cargar un nuevo Excel) y refresca chips/lista en consecuencia.
function refreshMachineCombobox() {
  if (!dom.formMachineSelect) return;
  const labels = getMachineOptionLabels();
  const validSelection = selectedMachines.filter(label => labels.includes(label));
  if (validSelection.length !== selectedMachines.length) {
    selectedMachines = validSelection;
  }
  renderMachineChips();
  if (dom.formMachineList && !dom.formMachineList.hidden) {
    renderMachineListOptions(dom.formMachineSearch ? dom.formMachineSearch.value : '');
  }
}

// Reemplaza la selección completa (usado al abrir "Editar movimiento").
function setSelectedMachines(labels) {
  const labelSet = new Set(getMachineOptionLabels());
  selectedMachines = (labels || []).filter(l => l && labelSet.has(l)).slice(0, MAX_MACHINES);
  renderMachineChips();
}

// Pinta los "chips" de artículos seleccionados y mantiene sincronizado el
// input oculto "machine" (múltiples artículos separados por coma) que es lo
// que finalmente viaja en el FormData del formulario.
function renderMachineChips() {
  const chipsEl = document.querySelector('#formMachineChips');
  if (chipsEl) {
    chipsEl.innerHTML = selectedMachines.map(label => `
      <span class="machine-chip">
        <span class="machine-chip-label">${label}</span>
        <button type="button" class="machine-chip-remove" data-value="${label.replace(/"/g, '&quot;')}" aria-label="Quitar ${label.replace(/"/g, '&quot;')}">×</button>
      </span>`).join('');
    chipsEl.style.display = selectedMachines.length ? 'flex' : 'none';
  }
  if (dom.formMachineSelect) dom.formMachineSelect.value = selectedMachines.join(', ');
  if (dom.formMachineSearch) {
    dom.formMachineSearch.placeholder = selectedMachines.length >= MAX_MACHINES
      ? `Máximo de ${MAX_MACHINES} artículos alcanzado`
      : `Escriba para buscar y agregar maquinaria... (${selectedMachines.length}/${MAX_MACHINES})`;
  }
}

function renderMachineListOptions(query) {
  const listEl = dom.formMachineList;
  if (!listEl) return;
  machineListActiveIndex = -1;
  const q = String(query || '').trim().toLowerCase();
  const labels = getMachineOptionLabels();

  if (!labels.length) {
    listEl.innerHTML = '<div class="combobox-empty">Cargue el Excel de Maquinaria primero</div>';
    return;
  }
  const filtered = q ? labels.filter(label => label.toLowerCase().includes(q)) : labels;
  if (!filtered.length) {
    listEl.innerHTML = '<div class="combobox-empty">Sin coincidencias</div>';
    return;
  }
  const atMax = selectedMachines.length >= MAX_MACHINES;
  listEl.innerHTML = filtered.map(label => {
    const isSelected = selectedMachines.includes(label);
    const atLimitClass = (!isSelected && atMax) ? ' at-limit' : '';
    return `<div class="combobox-option${isSelected ? ' selected' : ''}${atLimitClass}" role="option" data-value="${label.replace(/"/g, '&quot;')}">${isSelected ? '✓ ' : ''}${label}</div>`;
  }).join('');
}

function openMachineList() {
  if (!dom.formMachineList) return;
  renderMachineListOptions(dom.formMachineSearch ? dom.formMachineSearch.value : '');
  dom.formMachineList.hidden = false;
}

function closeMachineList() {
  if (!dom.formMachineList) return;
  dom.formMachineList.hidden = true;
  machineListActiveIndex = -1;
}

// Alterna la selección de un artículo: lo agrega si no estaba (respetando
// el máximo de 5) o lo quita si ya estaba seleccionado.
function toggleMachineOption(value) {
  if (!value) return;
  if (selectedMachines.includes(value)) {
    removeMachineSelection(value);
    return;
  }
  if (selectedMachines.length >= MAX_MACHINES) {
    alert(`Solo puede seleccionar hasta ${MAX_MACHINES} artículos de maquinaria por movimiento.`);
    return;
  }
  selectedMachines.push(value);
  renderMachineChips();
  if (dom.formMachineSearch) {
    dom.formMachineSearch.value = '';
    dom.formMachineSearch.focus();
  }
  openMachineList();
}

function removeMachineSelection(value) {
  selectedMachines = selectedMachines.filter(l => l !== value);
  renderMachineChips();
  if (dom.formMachineList && !dom.formMachineList.hidden) {
    renderMachineListOptions(dom.formMachineSearch ? dom.formMachineSearch.value : '');
  }
}

function highlightMachineOption(options) {
  options.forEach((opt, i) => opt.classList.toggle('active', i === machineListActiveIndex));
  const active = options[machineListActiveIndex];
  if (active) active.scrollIntoView({ block: 'nearest' });
}

function handleMachineListKeydown(event) {
  if (!dom.formMachineList) return;

  if (dom.formMachineList.hidden) {
    if (event.key === 'ArrowDown' || event.key === 'Enter') {
      event.preventDefault();
      openMachineList();
    }
    return;
  }

  const options = Array.from(dom.formMachineList.querySelectorAll('.combobox-option'));
  if (event.key === 'ArrowDown') {
    event.preventDefault();
    if (options.length) {
      machineListActiveIndex = Math.min(machineListActiveIndex + 1, options.length - 1);
      highlightMachineOption(options);
    }
  } else if (event.key === 'ArrowUp') {
    event.preventDefault();
    if (options.length) {
      machineListActiveIndex = Math.max(machineListActiveIndex - 1, 0);
      highlightMachineOption(options);
    }
  } else if (event.key === 'Enter') {
    if (machineListActiveIndex >= 0 && options[machineListActiveIndex]) {
      event.preventDefault();
      toggleMachineOption(options[machineListActiveIndex].dataset.value);
    }
  } else if (event.key === 'Escape') {
    closeMachineList();
  }
}

// Lee el archivo Excel de Maquinaria adjuntado por el Administrador y
// reemplaza el catálogo completo, dejando su contenido disponible de
// inmediato en el <select> Maquinaria de la vista "Nuevo movimiento".
async function handleMaquinariaExcelUpload() {
  if (!currentUser || currentUser.role !== 'Administrador') return;

  const fileInput = document.querySelector('#maquinariaFileInput');
  const file = fileInput && fileInput.files && fileInput.files[0];
  if (!file) { alert('Seleccione primero un archivo Excel (.xlsx).'); return; }

  if (typeof XLSX === 'undefined') {
    alert('No se pudo cargar la librería para leer archivos Excel. Verifique su conexión a internet e intente nuevamente.');
    return;
  }

  const confirmReplace = confirm(`Esto reemplazará el catálogo actual de Maquinaria (${maquinaria.length} artículos) con el contenido de "${file.name}". ¿Desea continuar?`);
  if (!confirmReplace) { fileInput.value = ''; return; }

  try {
    const buffer = await file.arrayBuffer();
    const workbook = XLSX.read(buffer, { type: 'array' });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const rows = XLSX.utils.sheet_to_json(sheet, { defval: '' });

    if (!rows.length) {
      alert('El archivo Excel no contiene filas de datos.');
      return;
    }

    // Detección flexible de columnas (por si el encabezado varía levemente
    // entre archivos, ej. "Cod. Maquina" / "Código" / "Desc. Maquina").
    const sampleKeys = Object.keys(rows[0]);
    const codeKey = sampleKeys.find(k => /cod/i.test(k)) || sampleKeys[0];
    const descKey = sampleKeys.find(k => /desc/i.test(k)) || sampleKeys[1];

    if (!codeKey || !descKey) {
      alert('No se pudieron identificar las columnas de código y descripción en el archivo.');
      return;
    }

    const parsed = normalizeMaquinaria(rows.map(r => ({
      codigo: r[codeKey],
      descripcion: r[descKey]
    })));

    if (!parsed.length) {
      alert('El archivo no contiene artículos de maquinaria válidos.');
      return;
    }

    maquinaria = parsed;
    saveMaquinaria(maquinaria);
    renderCatalogs();
    alert(`Se cargaron ${parsed.length} artículos de maquinaria desde "${file.name}".`);
  } catch (err) {
    console.error(err);
    alert('No se pudo leer el archivo. Verifique que sea un Excel válido (.xlsx o .xls).');
  } finally {
    fileInput.value = '';
  }
}

// ─── Edit starters ────────────────────────────────────────────────────────────
function startEditCentroCosto(idx) {
  editingCentroCostoIndex = idx;
  const nameInput = document.querySelector('#centroCostoNameInput');
  const numberInput = document.querySelector('#centroCostoNumberInput');
  const cancelBtn = document.querySelector('#cancelCentroCostoEdit');
  const addBtn = document.querySelector('#addCentroCostoBtn');
  const c = centrosCosto[idx];
  if (nameInput) nameInput.value = c.nombre;
  if (numberInput) numberInput.value = c.numero || '';
  if (cancelBtn) cancelBtn.style.display = 'inline-flex';
  if (addBtn) addBtn.textContent = 'Guardar';
}

function startEditDriver(idx) {
  editingDriverIndex = idx;
  const nameInput = document.querySelector('#newDriverName');
  const lastNameInput = document.querySelector('#newDriverLastName');
  const cancelBtn = document.querySelector('#cancelDriverEdit');
  const addBtn = document.querySelector('#addDriverBtn');
  if (nameInput) nameInput.value = choferes[idx].firstName;
  if (lastNameInput) lastNameInput.value = choferes[idx].lastName;
  if (cancelBtn) cancelBtn.style.display = 'inline-flex';
  if (addBtn) addBtn.textContent = 'Guardar';
}

function startEditVehicle(idx) {
  editingVehicleIndex = idx;
  const plateInput = document.querySelector('#newVehiclePlate');
  const marcaInput = document.querySelector('#newVehicleMarca');
  const tipoInput = document.querySelector('#newVehicleTipo');
  const colorInput = document.querySelector('#newVehicleColor');
  const cancelBtn = document.querySelector('#cancelVehicleEdit');
  const addBtn = document.querySelector('#addVehicleBtn');
  const v = vehiculos[idx];
  if (plateInput) plateInput.value = v.plate;
  if (marcaInput) marcaInput.value = v.marca || '';
  if (tipoInput) tipoInput.value = v.tipo || '';
  if (colorInput) colorInput.value = v.color || '';
  if (cancelBtn) cancelBtn.style.display = 'inline-flex';
  if (addBtn) addBtn.textContent = 'Guardar';
}

function startEditMaquinaria(idx) {
  editingMaquinariaIndex = idx;
  const codeInput = document.querySelector('#maquinariaCodeInput');
  const descInput = document.querySelector('#maquinariaDescInput');
  const cancelBtn = document.querySelector('#cancelMaquinariaEdit');
  const addBtn = document.querySelector('#addMaquinariaBtn');
  const item = maquinaria[idx];
  if (codeInput) codeInput.value = item.codigo || '';
  if (descInput) descInput.value = item.descripcion || '';
  if (cancelBtn) cancelBtn.style.display = 'inline-flex';
  if (addBtn) addBtn.textContent = 'Guardar';
}

// ─── Cancel edit helpers ──────────────────────────────────────────────────────
function cancelCentroCostoEdit() {
  editingCentroCostoIndex = null;
  const nameInput = document.querySelector('#centroCostoNameInput');
  const numberInput = document.querySelector('#centroCostoNumberInput');
  const cancelBtn = document.querySelector('#cancelCentroCostoEdit');
  const addBtn = document.querySelector('#addCentroCostoBtn');
  if (nameInput) nameInput.value = '';
  if (numberInput) numberInput.value = '';
  if (cancelBtn) cancelBtn.style.display = 'none';
  if (addBtn) addBtn.textContent = 'Agregar';
}

function cancelDriverEdit() {
  editingDriverIndex = null;
  const nameInput = document.querySelector('#newDriverName');
  const lastNameInput = document.querySelector('#newDriverLastName');
  const cancelBtn = document.querySelector('#cancelDriverEdit');
  const addBtn = document.querySelector('#addDriverBtn');
  if (nameInput) nameInput.value = '';
  if (lastNameInput) lastNameInput.value = '';
  if (cancelBtn) cancelBtn.style.display = 'none';
  if (addBtn) addBtn.textContent = 'Agregar';
}

function cancelVehicleEdit() {
  editingVehicleIndex = null;
  const plateInput = document.querySelector('#newVehiclePlate');
  const marcaInput = document.querySelector('#newVehicleMarca');
  const tipoInput = document.querySelector('#newVehicleTipo');
  const colorInput = document.querySelector('#newVehicleColor');
  const cancelBtn = document.querySelector('#cancelVehicleEdit');
  const addBtn = document.querySelector('#addVehicleBtn');
  if (plateInput) plateInput.value = '';
  if (marcaInput) marcaInput.value = '';
  if (tipoInput) tipoInput.value = '';
  if (colorInput) colorInput.value = '';
  if (cancelBtn) cancelBtn.style.display = 'none';
  if (addBtn) addBtn.textContent = 'Agregar';
}

function cancelMaquinariaEdit() {
  editingMaquinariaIndex = null;
  const codeInput = document.querySelector('#maquinariaCodeInput');
  const descInput = document.querySelector('#maquinariaDescInput');
  const cancelBtn = document.querySelector('#cancelMaquinariaEdit');
  const addBtn = document.querySelector('#addMaquinariaBtn');
  if (codeInput) codeInput.value = '';
  if (descInput) descInput.value = '';
  if (cancelBtn) cancelBtn.style.display = 'none';
  if (addBtn) addBtn.textContent = 'Agregar';
}

function renderCatalogs() {
  renderCentrosCosto();
  renderChoferes();
  renderVehiculos();
  renderMaquinaria();
  populateUserFormSelects();
  populateReportFilterOptions();
}

function populateFormDropdowns() {
  renderCentrosCosto();
  renderChoferes();
  renderVehiculos();
  renderMaquinaria();
}

function handleDeleteCatalogItem(type, key) {
  if (!currentUser || currentUser.role !== 'Administrador') return;
  
  if (type === 'centroCosto') {
    const inUse = movements.some(m => m.sender === key || m.destination === key) ||
      Object.values(users).some(u => u.centroCostoAsignado === key);
    const warning = inUse
      ? `El centro de trabajo "${key}" está en uso en movimientos o usuarios registrados. `
      : '';
    const confirmDel = confirm(`${warning}¿Está seguro de que desea eliminar el centro de trabajo "${key}"?`);
    if (confirmDel) {
      centrosCosto = centrosCosto.filter(c => c.nombre !== key);
      saveCentrosCosto(centrosCosto);
      renderCatalogs();
    }
  } else if (type === 'chofer') {
    const c = choferes.find(item => driverLabel(item) === key);
    if (!c) return;
    const confirmDel = confirm(`¿Está seguro de que desea eliminar al chofer "${c.firstName} ${c.lastName}"?`);
    if (confirmDel) {
      choferes = choferes.filter(item => driverLabel(item) !== key);
      saveChoferes(choferes);
      renderCatalogs();
    }
  } else if (type === 'vehiculo') {
    const confirmDel = confirm(`¿Está seguro de que desea eliminar el vehículo con patente "${key}"?`);
    if (confirmDel) {
      vehiculos = vehiculos.filter(v => v.plate !== key);
      saveVehiculos(vehiculos);
      renderCatalogs();
    }
  } else if (type === 'maquinaria') {
    const item = maquinaria.find(m => (m.codigo || m.descripcion) === key);
    if (!item) return;
    const inUse = movements.some(m => m.machine === maquinariaLabel(item));
    const warning = inUse ? `El artículo "${maquinariaLabel(item)}" está en uso en movimientos registrados. ` : '';
    const confirmDel = confirm(`${warning}¿Está seguro de que desea eliminar "${maquinariaLabel(item)}" del catálogo de Maquinaria?`);
    if (confirmDel) {
      maquinaria = maquinaria.filter(m => (m.codigo || m.descripcion) !== key);
      saveMaquinaria(maquinaria);
      renderCatalogs();
    }
  }
}

function handleAddCatalogItem(type) {
  if (!currentUser || currentUser.role !== 'Administrador') return;
  
  if (type === 'centroCosto') {
    const nameInput = document.querySelector('#centroCostoNameInput');
    const numberInput = document.querySelector('#centroCostoNumberInput');
    const nombre = nameInput.value.trim().toUpperCase();
    const numero = (numberInput ? numberInput.value : '').trim();
    if (!nombre) { alert('El nombre del centro de trabajo es obligatorio.'); return; }
    if (!numero) { alert('El número del centro de trabajo es obligatorio.'); return; }
    if (editingCentroCostoIndex !== null) {
      const dupName = centrosCosto.some((c, i) => i !== editingCentroCostoIndex && c.nombre === nombre);
      const dupNumber = centrosCosto.some((c, i) => i !== editingCentroCostoIndex && c.numero === numero);
      if (dupName) { alert('Ya existe un centro de trabajo con ese nombre.'); return; }
      if (dupNumber) { alert('Ya existe un centro de trabajo con ese número.'); return; }
      centrosCosto[editingCentroCostoIndex] = { nombre, numero };
      cancelCentroCostoEdit();
    } else {
      if (centrosCosto.some(c => c.nombre === nombre)) { alert('Ya existe un centro de trabajo con ese nombre.'); return; }
      if (centrosCosto.some(c => c.numero === numero)) { alert('Ya existe un centro de trabajo con ese número.'); return; }
      centrosCosto.push({ nombre, numero });
    }
    saveCentrosCosto(centrosCosto);
    nameInput.value = '';
    if (numberInput) numberInput.value = '';
    renderCatalogs();
  } else if (type === 'chofer') {
    const nameInput = document.querySelector('#newDriverName');
    const lastNameInput = document.querySelector('#newDriverLastName');
    const firstName = nameInput.value.trim();
    const lastName = lastNameInput.value.trim();
    if (!firstName || !lastName) { alert('Por favor, complete Nombre y Apellido.'); return; }
    const label = `${firstName} ${lastName}`.trim().toUpperCase();
    if (editingDriverIndex !== null) {
      choferes[editingDriverIndex] = { firstName, lastName };
      cancelDriverEdit();
    } else {
      const exists = choferes.some(c => driverLabel(c).toUpperCase() === label);
      if (exists) { alert('Ya existe un chofer registrado con ese nombre.'); return; }
      choferes.push({ firstName, lastName });
    }
    saveChoferes(choferes);
    nameInput.value = '';
    lastNameInput.value = '';
    renderCatalogs();
  } else if (type === 'vehiculo') {
    const plateInput = document.querySelector('#newVehiclePlate');
    const marcaInput = document.querySelector('#newVehicleMarca');
    const tipoInput = document.querySelector('#newVehicleTipo');
    const colorInput = document.querySelector('#newVehicleColor');
    const plate = plateInput.value.trim().toUpperCase();
    const marca = (marcaInput ? marcaInput.value : '').trim().toUpperCase();
    const tipo = (tipoInput ? tipoInput.value : '').trim().toUpperCase();
    const color = (colorInput ? colorInput.value : '').trim().toUpperCase();
    if (!plate) { alert('La patente es obligatoria.'); return; }
    if (editingVehicleIndex !== null) {
      vehiculos[editingVehicleIndex] = { plate, marca, tipo, color };
      vehiculos = normalizeVehicles(vehiculos);
      cancelVehicleEdit();
    } else {
      if (vehiculos.some(v => v.plate === plate)) { alert('Esta patente ya existe.'); return; }
      vehiculos.push({ plate, marca, tipo, color });
      vehiculos = normalizeVehicles(vehiculos);
    }
    saveVehiculos(vehiculos);
    plateInput.value = '';
    if (marcaInput) marcaInput.value = '';
    if (tipoInput) tipoInput.value = '';
    if (colorInput) colorInput.value = '';
    renderCatalogs();
  } else if (type === 'maquinaria') {
    const codeInput = document.querySelector('#maquinariaCodeInput');
    const descInput = document.querySelector('#maquinariaDescInput');
    const codigo = codeInput.value.trim();
    const descripcion = descInput.value.replace(/\s+/g, ' ').trim();
    if (!descripcion) { alert('La descripción del artículo es obligatoria.'); return; }
    if (editingMaquinariaIndex !== null) {
      const dupCode = codigo && maquinaria.some((m, i) => i !== editingMaquinariaIndex && m.codigo === codigo);
      if (dupCode) { alert('Ya existe un artículo de maquinaria con ese código.'); return; }
      maquinaria[editingMaquinariaIndex] = { codigo, descripcion };
      cancelMaquinariaEdit();
    } else {
      if (codigo && maquinaria.some(m => m.codigo === codigo)) { alert('Ya existe un artículo de maquinaria con ese código.'); return; }
      maquinaria.push({ codigo, descripcion });
    }
    saveMaquinaria(maquinaria);
    codeInput.value = '';
    descInput.value = '';
    renderCatalogs();
  }
}

function renderAll() {
  renderMetrics();
  renderTables();
  renderAlerts();
  renderCatalogs();
  renderWelcomeBanner();
}

// Vista Home: saludo personalizado al usuario logeado.
function renderWelcomeBanner() {
  if (!dom.welcomeBannerText || !dom.welcomeBannerSubtext) return;
  if (!currentUser) return;
  const nombre = currentUser.firstName || currentUser.username;
  const esAdministrador = currentUser.role === 'Administrador';
  dom.welcomeBannerText.textContent = `¡Hola, ${nombre}!`;
  dom.welcomeBannerSubtext.textContent = (!esAdministrador && currentUser.centroCostoAsignado)
    ? `Este es el resumen de ${currentUser.centroCostoAsignado}.`
    : 'Bienvenido de vuelta.';
}

function switchView(view) {
// NUEVO: Bloqueo estricto si un operador intenta pasarse de listo con la vista de usuarios
  if (view === 'users' && (!currentUser || currentUser.role !== 'Administrador')) {
    switchView('dashboard');
    return;
  }
  const titles = {
    dashboard: ['Home', new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })],
    movements: ['Movimientos', 'Registro y filtros'],
    centrosCosto: ['Centros de trabajo', 'Gestión de centros de trabajo (emisores / destinos)'],
    choferes: ['Choferes', 'Gestión de conductores'],
    vehiculos: ['Vehículos', 'Gestión de patentes y vehículos'],
    maquinaria: ['Maquinaria', 'Catálogo cargado desde Excel'],
    users: ['Usuarios', 'Gestión de cuentas y accesos'],
    reports: ['Reportes', 'Movimientos por periodo y ubicación de maquinaria por centro de trabajo'],
    profile: ['Mi Perfil', 'Información básica de tu cuenta']
  };
  document.querySelectorAll('.view').forEach(i => i.classList.remove('active-view'));
  document.querySelector(`#${view}View`).classList.add('active-view');
  dom.navItems.forEach(i => i.classList.toggle('active', i.dataset.view === view));
  dom.viewTitle.textContent = titles[view] ? titles[view][0] : 'Panel';
  dom.viewSubtitle.textContent = titles[view] ? titles[view][1] : '';
}

// Muestra el campo "N° de guía" o "N° de Memo" según el tipo de documento
// elegido, y ajusta cuál de los dos es obligatorio.
function updateDocTypeFieldVisibility() {
  const isMemo = dom.formDocTypeSelect.value === 'Memo';
  dom.guideFieldLabel.style.display = isMemo ? 'none' : '';
  dom.memoFieldLabel.style.display = isMemo ? '' : 'none';
  dom.formGuideInput.required = !isMemo;
  dom.formMemoInput.required = isMemo;
}

// Acepta solo dígitos y limita a 10 caracteres (N° de guía / N° de Memo).
function sanitizeDocNumberInput(inputEl) {
  inputEl.value = inputEl.value.replace(/\D/g, '').slice(0, 10);
}

function openDrawer() {
  dom.drawerTitle.textContent = 'Nuevo movimiento';
  dom.formGuideInput.disabled = false;
  dom.formMemoInput.disabled = false;
  dom.formDocTypeSelect.disabled = false;
  dom.formDocTypeSelect.value = 'Guía';
  updateDocTypeFieldVisibility();
  if (dom.formMachineSearch) { dom.formMachineSearch.disabled = false; dom.formMachineSearch.value = ''; }
  setSelectedMachines([]);
  closeMachineList();
  // Limpiar los combobox de búsqueda de Emisor, Destino, Chofer y Patente.
  [senderCombobox, destinationCombobox, driverCombobox, vehicleCombobox].forEach(cb => cb.clear());
  if (dom.formSenderSearch) dom.formSenderSearch.disabled = false;
  if (dom.formDestinationSearch) dom.formDestinationSearch.disabled = false;
  if (dom.formDriverSearch) dom.formDriverSearch.disabled = false;
  if (dom.formVehicleSearch) dom.formVehicleSearch.disabled = false;
  const formSenderLockedHint = document.querySelector('#formSenderLockedHint');
  if (formSenderLockedHint) formSenderLockedHint.style.display = 'none';

  // Las cuentas de usuario (no Administrador) no eligen el Emisor: siempre
  // es el centro de trabajo al que está asociada la cuenta, y queda fijo.
  const isAdminForNewMovement = currentUser && currentUser.role === 'Administrador';
  if (!isAdminForNewMovement && currentUser && currentUser.centroCostoAsignado) {
    senderCombobox.select(currentUser.centroCostoAsignado);
    if (dom.formSenderSearch) dom.formSenderSearch.disabled = true;
    if (formSenderLockedHint) formSenderLockedHint.style.display = 'block';
  }

  dom.drawer.classList.add('open');
  dom.drawer.setAttribute('aria-hidden', 'false');
  dom.drawerBackdrop.hidden = false;
  
  // Precargar fecha local en formato YYYY-MM-DD sin problemas de zona horaria
  dom.form.elements.date.value = todayISODate();
}

function closeDrawer() {
  dom.drawer.classList.remove('open');
  dom.drawer.setAttribute('aria-hidden', 'true');
  dom.drawerBackdrop.hidden = true;
  dom.form.reset();
  setSelectedMachines([]);
  closeMachineList();
  
  // Restaurar habilitación de todos los campos
  dom.formGuideInput.disabled = false;
  dom.formMemoInput.disabled = false;
  dom.formDocTypeSelect.disabled = false;
  dom.form.elements.date.disabled = false;
  dom.form.elements.machine.disabled = false;
  if (dom.formMachineSearch) dom.formMachineSearch.disabled = false;
  dom.form.elements.sender.disabled = false;
  dom.form.elements.destination.disabled = false;
  dom.form.elements.driver.disabled = false;
  dom.form.elements.vehiclePlate.disabled = false;
  if (dom.formSenderSearch) dom.formSenderSearch.disabled = false;
  if (dom.formDestinationSearch) dom.formDestinationSearch.disabled = false;
  if (dom.formDriverSearch) dom.formDriverSearch.disabled = false;
  if (dom.formVehicleSearch) dom.formVehicleSearch.disabled = false;
  dom.form.elements.note.disabled = false;
  updateDocTypeFieldVisibility();
  
  dom.drawerTitle.textContent = 'Nuevo movimiento';
  dom.formMessage.textContent = 'Registro local';
  editingGuide = null;
}

// Cierra cualquier panel lateral (formulario o detalle) que esté abierto,
// ya que ambos comparten el mismo fondo (backdrop).
function closeAnyDrawer() {
  if (dom.drawer.classList.contains('open')) {
    closeDrawer();
  }
  if (dom.detailDrawer && dom.detailDrawer.classList.contains('open')) {
    closeDetailDrawer();
  }
}

// Muestra el detalle completo de un movimiento: usuario que lo emitió,
// centro de trabajo del usuario emisor, destino del movimiento, usuario que
// verificó, fecha de emisión y fecha de recepción.
function openDetailDrawer(guide) {
  const movement = movements.find(m => String(m.guide) === String(guide));
  if (!movement || !dom.detailDrawer) return;

  const creatorUser = users[movement.createdBy];
  const creatorFullName = getUserFullName(movement.createdBy);
  const senderCentro = creatorUser ? (creatorUser.centroCostoAsignado || '-') : '-';

  const verifierFullName = movement.verifiedBy ? getUserFullName(movement.verifiedBy) : 'Aún no verificado';

  const verification = normalizeVerification(movement.verification);
  const verificationLabel = verification;

  // RF-08: información del vehículo que realizó el movimiento, tomada del
  // catálogo de Vehículos (marca, tipo, color) además de la patente.
  const vehicle = vehiculos.find(v => v.plate === String(movement.vehiclePlate || '').trim().toUpperCase());

  const docType = movement.docType === 'Memo' ? 'Memo' : 'Guía';
  dom.detailSubtitle.textContent = `${docType} Nº ${movement.guide}`;
  if (dom.detailGuideLabel) dom.detailGuideLabel.textContent = docType;
  dom.detailGuide.textContent = movement.guide;
  // La Maquinaria puede incluir varios artículos (hasta 5, separados por
  // coma); se listan como viñetas. El código de cada artículo se muestra
  // como una etiqueta aparte ("Cód. N") en vez de "N - Descripción", para
  // que no se confunda con la numeración de la propia lista.
  const machineItems = String(movement.machine || '').split(',').map(s => s.trim()).filter(Boolean);
  dom.detailMachine.innerHTML = machineItems.length
    ? machineItems.map(item => {
        const dashIndex = item.indexOf(' - ');
        if (dashIndex === -1) return `<li>${item}</li>`;
        const codigo = item.slice(0, dashIndex);
        const descripcion = item.slice(dashIndex + 3);
        return `<li><span class="machine-code-badge">Cód. ${codigo}</span>${descripcion}</li>`;
      }).join('')
    : '<li>-</li>';
  dom.detailDriver.textContent = movement.driver;
  dom.detailPlate.textContent = movement.vehiclePlate || '-';
  if (dom.detailVehicleBrand) dom.detailVehicleBrand.textContent = (vehicle && vehicle.marca) || '-';
  if (dom.detailVehicleType) dom.detailVehicleType.textContent = (vehicle && vehicle.tipo) || '-';
  if (dom.detailVehicleColor) dom.detailVehicleColor.textContent = (vehicle && vehicle.color) || '-';

  dom.detailSenderUser.textContent = creatorFullName;
  dom.detailSenderCentro.textContent = senderCentro;
  dom.detailDestination.textContent = movement.destination;

  dom.detailVerifiedBy.textContent = verifierFullName;
  dom.detailVerification.textContent = verificationLabel;
  dom.detailDate.textContent = formatDate(movement.date);
  dom.detailReceivedDate.textContent = movement.receivedDate ? formatDate(movement.receivedDate) : 'Pendiente';

  const noteAuth = canReadNote(movement);
  if (dom.detailNotePanel) dom.detailNotePanel.style.display = noteAuth ? 'block' : 'none';
  if (dom.detailNote) dom.detailNote.textContent = noteAuth ? (movement.note || 'Sin observaciones') : '🔒 Oculto';

  dom.detailDrawer.classList.add('open');
  dom.detailDrawer.setAttribute('aria-hidden', 'false');
  dom.drawerBackdrop.hidden = false;
}

function closeDetailDrawer() {
  if (!dom.detailDrawer) return;
  dom.detailDrawer.classList.remove('open');
  dom.detailDrawer.setAttribute('aria-hidden', 'true');
  dom.drawerBackdrop.hidden = true;
}

function openEditDrawer(guide) {
  const movement = movements.find(m => String(m.guide) === String(guide));
  if (!movement) return;

  // El formulario de edición del movimiento (fecha, maquinaria, emisor,
  // destino, chofer, patente, nota) es exclusivo del Administrador. La
  // verificación se cambia únicamente desde el <select> de la columna
  // Verificación (RN-02) y no desde este formulario.
  const isAdmin = currentUser && currentUser.role === 'Administrador';
  if (!isAdmin) {
    alert('No tiene permisos suficientes para editar este movimiento.');
    return;
  }

  editingGuide = guide;

  dom.drawerTitle.textContent = 'Editar movimiento';
  const docType = movement.docType === 'Memo' ? 'Memo' : 'Guía';
  dom.formDocTypeSelect.value = docType;
  updateDocTypeFieldVisibility();
  if (docType === 'Memo') {
    dom.formMemoInput.value = movement.guide;
  } else {
    dom.formGuideInput.value = movement.guide;
  }
  dom.formGuideInput.disabled = true;
  dom.formMemoInput.disabled = true;
  dom.formDocTypeSelect.disabled = true;
  
  dom.form.elements.date.value = movement.date;
  const machineLabels = String(movement.machine || '').split(',').map(s => s.trim()).filter(Boolean);
  setSelectedMachines(machineLabels);
  if (dom.formMachineSearch) dom.formMachineSearch.value = '';
  closeMachineList();
  senderCombobox.select(movement.sender);
  destinationCombobox.select(movement.destination);
  driverCombobox.select(movement.driver);
  vehicleCombobox.select(movement.vehiclePlate || '');
  dom.form.elements.note.value = movement.note || '';

  dom.form.elements.date.disabled = false;
  dom.form.elements.machine.disabled = false;
  if (dom.formMachineSearch) dom.formMachineSearch.disabled = false;
  dom.form.elements.sender.disabled = false;
  dom.form.elements.destination.disabled = false;
  dom.form.elements.driver.disabled = false;
  dom.form.elements.vehiclePlate.disabled = false;
  if (dom.formSenderSearch) dom.formSenderSearch.disabled = false;
  if (dom.formDestinationSearch) dom.formDestinationSearch.disabled = false;
  if (dom.formDriverSearch) dom.formDriverSearch.disabled = false;
  if (dom.formVehicleSearch) dom.formVehicleSearch.disabled = false;
  dom.form.elements.note.disabled = false;

  // Open drawer
  dom.drawer.classList.add('open');
  dom.drawer.setAttribute('aria-hidden', 'false');
  dom.drawerBackdrop.hidden = false;
}

function handleDelete(guide) {
  if (!currentUser || currentUser.role !== 'Administrador') {
    alert('No tiene permisos para realizar esta acción.');
    return;
  }
  const confirmDelete = confirm(`¿Está seguro de que desea eliminar el movimiento con guía Nº ${guide}? Esta acción no se puede deshacer.`);
  if (confirmDelete) {
    movements = movements.filter(m => String(m.guide) !== String(guide));
    saveMovements();
    renderAll();
  }
}

// Único punto de cambio del estado de verificación de un movimiento (RN-02).
// Se invoca exclusivamente desde el <select> de la columna Verificación.
function handleVerificationChange(guide, newValue, selectEl) {
  const movement = movements.find(m => String(m.guide) === String(guide));
  if (!movement) return;

  if (!canVerifyMovement(movement)) {
    alert(
      currentUser && currentUser.username === movement.createdBy
        ? 'No puede verificar un movimiento que usted mismo emitió.'
        : 'No tiene permisos para verificar este movimiento.'
    );
    if (selectEl) selectEl.value = normalizeVerification(movement.verification);
    return;
  }

  const value = VERIFICATION_STATES.includes(newValue) ? newValue : 'Pendiente';

  movement.verification = value;
  if (value === 'Pendiente') {
    movement.verifiedBy = null;
    movement.receivedDate = null;
  } else {
    movement.verifiedBy = currentUser.username;
    movement.receivedDate = todayISODate();
  }
  movement.modifiedBy = currentUser.username;
  movement.modifiedAt = new Date().toISOString();

  saveMovements();
  renderAll();
}

function handleSubmit(event) {
  event.preventDefault();
  
  if (!currentUser) {
    alert('Debe iniciar sesión para registrar movimientos.');
    return;
  }

  const formData = new FormData(dom.form);
  const fields = Object.fromEntries(formData.entries());

  // El campo Maquinaria es un combobox de selección múltiple (hasta 5
  // artículos) con filtro de texto: los valores reales viajan en el arreglo
  // `selectedMachines` y se reflejan en un input oculto separados por coma.
  // Como los inputs ocultos no participan de la validación nativa
  // "required", se valida aquí.
  if (!selectedMachines.length) {
    dom.formMessage.textContent = 'Debe seleccionar al menos un artículo de maquinaria de la lista.';
    dom.formMessage.style.color = 'var(--red)';
    if (dom.formMachineSearch) dom.formMachineSearch.focus();
    return;
  }
  if (selectedMachines.length > MAX_MACHINES) {
    dom.formMessage.textContent = `Solo puede seleccionar hasta ${MAX_MACHINES} artículos de maquinaria.`;
    dom.formMessage.style.color = 'var(--red)';
    return;
  }
  fields.machine = selectedMachines.join(', ');

  // Emisor, Destino, Chofer y Patente son combobox de búsqueda (selección
  // única): el valor real vive en un input oculto. Como los inputs ocultos
  // no participan de la validación nativa "required", se valida aquí.
  const requiredComboFields = [
    ['sender', 'Emisor', dom.formSenderSearch],
    ['destination', 'Destino', dom.formDestinationSearch],
    ['driver', 'Chofer', dom.formDriverSearch],
    ['vehiclePlate', 'Patente', dom.formVehicleSearch]
  ];
  for (const [fieldName, label, searchEl] of requiredComboFields) {
    if (!String(fields[fieldName] || '').trim()) {
      dom.formMessage.textContent = `Debe seleccionar "${label}" de la lista.`;
      dom.formMessage.style.color = 'var(--red)';
      if (searchEl) searchEl.focus();
      return;
    }
  }

  // Tipo de documento: "Guía" o "Memo". Cada uno alimenta su propio campo
  // numérico (N° de guía / N° de Memo); solo el campo visible según el tipo
  // seleccionado se usa como identificador del movimiento. Al editar, el
  // selector queda deshabilitado (no se puede cambiar el tipo de un
  // movimiento existente) por lo que no viaja en el FormData: se recupera
  // del movimiento original.
  let docType;
  if (editingGuide) {
    const originalForType = movements.find(m => String(m.guide) === String(editingGuide));
    docType = (originalForType && originalForType.docType === 'Memo') ? 'Memo' : 'Guía';
  } else {
    docType = fields.docType === 'Memo' ? 'Memo' : 'Guía';
  }
  const docLabel = docType === 'Memo' ? 'N° de Memo' : 'N° de guía';

  // Usar el número en edición si está deshabilitado en el formulario
  const guideVal = editingGuide || (docType === 'Memo' ? fields.memoNumber : fields.guideNumber);

  if (!guideVal) {
    dom.formMessage.textContent = `El ${docLabel} es requerido.`;
    dom.formMessage.style.color = 'var(--red)';
    return;
  }

  // Debe ser únicamente números enteros, máximo 10 dígitos.
  if (!editingGuide && !/^[0-9]{1,10}$/.test(String(guideVal))) {
    dom.formMessage.textContent = `El ${docLabel} debe contener solo números enteros, con un máximo de 10 dígitos.`;
    dom.formMessage.style.color = 'var(--red)';
    return;
  }

  if (editingGuide) {
    const index = movements.findIndex(m => String(m.guide) === String(editingGuide));
    if (index !== -1) {
      const original = movements[index];
      const isAdmin = currentUser.role === 'Administrador';

      // La edición general del movimiento (fecha, maquinaria, emisor, destino,
      // chofer, patente, nota) es exclusiva del Administrador. La verificación
      // se gestiona aparte, únicamente desde la columna Verificación (RN-02).
      if (!isAdmin) {
        dom.formMessage.textContent = 'No tiene permisos suficientes para modificar este movimiento.';
        dom.formMessage.style.color = 'var(--red)';
        return;
      }

      const updatedMovement = {
        ...original,
        date: fields.date !== undefined ? fields.date : original.date,
        machine: fields.machine !== undefined ? fields.machine.trim() : original.machine,
        sender: fields.sender !== undefined ? fields.sender.trim() : original.sender,
        destination: fields.destination !== undefined ? fields.destination.trim() : original.destination,
        driver: fields.driver !== undefined ? fields.driver.trim() : original.driver,
        vehiclePlate: fields.vehiclePlate !== undefined ? fields.vehiclePlate.trim().toUpperCase() : original.vehiclePlate,
        note: fields.note !== undefined ? fields.note.trim() : original.note,
        modifiedBy: currentUser.username,
        modifiedAt: new Date().toISOString()
      };
      
      movements[index] = updatedMovement;
    }
  } else {
    // Autogenerar ID único numérico
    const nextId = movements.length > 0 ? Math.max(...movements.map(m => m.id || 0)) + 1 : 1;
    
    // Validar duplicado dentro del mismo tipo de documento (una Guía y un
    // Memo pueden compartir número sin ser el mismo documento).
    const exists = movements.some(m => String(m.guide) === String(guideVal) && (m.docType || 'Guía') === docType);
    if (exists) {
      dom.formMessage.textContent = `El ${docLabel} ${guideVal} ya existe.`;
      dom.formMessage.style.color = 'var(--red)';
      return;
    }
    
    // Todo movimiento nuevo se crea en estado "Pendiente" (RN-03). El estado
    // solo cambia posteriormente desde la columna Verificación.
    const newMovement = {
      id: nextId,
      date: fields.date,
      docType,
      guide: guideVal,
      machine: fields.machine.trim(),
      sender: fields.sender.trim(),
      destination: fields.destination.trim(),
      driver: fields.driver.trim(),
      vehiclePlate: fields.vehiclePlate.trim().toUpperCase(),
      verification: 'Pendiente',
      verifiedBy: null,
      receivedDate: null,
      note: (fields.note || '').trim(),
      createdBy: currentUser.username
    };
    movements.push(newMovement);
  }

  saveMovements();
  renderAll();
  closeDrawer();
}

function handleSubmitUser(event) {
  event.preventDefault();
  const data = new FormData(dom.userForm);
  const fields = Object.fromEntries(data.entries());
  
  const usernameVal = editingUsername || (fields.username ? fields.username.trim().toLowerCase() : '');

  if (!usernameVal) {
    dom.userFormMessage.style.color = 'var(--red)';
    dom.userFormMessage.textContent = 'El nombre de usuario es requerido.';
    return;
  }

  if (!editingUsername && !/^[a-z0-9_-]+$/i.test(usernameVal)) {
    dom.userFormMessage.style.color = 'var(--red)';
    dom.userFormMessage.textContent = 'El usuario solo debe contener letras, números y guiones.';
    return;
  }

  // Validar formato de correo
  if (fields.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) {
    dom.userFormMessage.style.color = 'var(--red)';
    dom.userFormMessage.textContent = 'Ingrese un correo electrónico válido.';
    return;
  }

  // Todo usuario debe estar asociado a un Centro de trabajo.
  if (!fields.centroCostoAsignado || !fields.centroCostoAsignado.trim()) {
    dom.userFormMessage.style.color = 'var(--red)';
    dom.userFormMessage.textContent = 'Debe asignar un Centro de trabajo al usuario.';
    return;
  }

  if (editingUsername) {
    // MODO EDICIÓN
    const target = users[editingUsername];
    if (!target) return;

    const isSelf = editingUsername === currentUser.username;
    if (isSelf && fields.role !== 'Administrador') {
      dom.userFormMessage.style.color = 'var(--red)';
      dom.userFormMessage.textContent = 'No puedes quitarte el rol de Administrador a ti mismo.';
      return;
    }

    target.firstName = fields.firstName.trim();
    target.lastName = fields.lastName.trim();
    target.centroCostoAsignado = fields.centroCostoAsignado.trim();
    target.email = fields.email.trim();
    target.pass = fields.pass;
    target.role = fields.role;

    if (isSelf) {
      currentUser = target;
      saveSession(currentUser);
      updateSessionUI();
    }

    saveUsers();
    renderUsers();
    resetUserForm();
    
    dom.userFormMessage.style.color = 'var(--teal)';
    dom.userFormMessage.textContent = 'Usuario actualizado con éxito.';
  } else {
    // MODO CREACIÓN
    if (users[usernameVal]) {
      dom.userFormMessage.style.color = 'var(--red)';
      dom.userFormMessage.textContent = 'El nombre de usuario ya existe.';
      return;
    }

    // Verificar si el correo ya existe
    const emailExists = Object.values(users).some(u => u.email && u.email.toLowerCase() === fields.email.trim().toLowerCase());
    if (emailExists) {
      dom.userFormMessage.style.color = 'var(--red)';
      dom.userFormMessage.textContent = 'El correo electrónico ya está registrado.';
      return;
    }

    users[usernameVal] = {
      username: usernameVal,
      firstName: fields.firstName.trim(),
      lastName: fields.lastName.trim(),
      centroCostoAsignado: fields.centroCostoAsignado.trim(),
      email: fields.email.trim(),
      role: fields.role,
      pass: fields.pass
    };

    saveUsers();
    renderUsers();
    resetUserForm();

    dom.userFormMessage.style.color = 'var(--teal)';
    dom.userFormMessage.textContent = '¡Usuario creado con éxito!';
    
    setTimeout(() => {
      if (dom.userFormMessage.textContent === '¡Usuario creado con éxito!') {
        dom.userFormMessage.textContent = '';
      }
    }, 3000);
  }
}

// ============================================================
// MÓDULO DE REPORTERÍA
// ============================================================

// Devuelve null si el usuario puede ver todos los centros de trabajo
// (Administrador), o su centro de trabajo asignado en mayúsculas si es un
// usuario restringido (RN-05 / RN-06 del diseño del módulo).
function getReportPermissionCentro() {
  if (!currentUser) return '';
  if (currentUser.role === 'Administrador') return null;
  return (currentUser.centroCostoAsignado || '').toUpperCase();
}

// Separa el campo "machine" de un movimiento (ej. "12 - EXCAVADORA, 45 - GRÚA")
// en sus etiquetas individuales.
function splitMachineLabels(machineField) {
  return (machineField || '').split(',').map(s => s.trim()).filter(Boolean);
}

// A partir de una etiqueta "{codigo} - {descripcion}" (o solo descripción si
// no hay código), separa sus partes. "key" es el identificador usado para
// agrupar el historial de una misma máquina.
function parseMachineLabel(label) {
  const idx = label.indexOf(' - ');
  if (idx === -1) return { codigo: null, descripcion: label, key: label };
  return { codigo: label.slice(0, idx), descripcion: label.slice(idx + 3), key: label.slice(0, idx) };
}

// Dado un año y número de semana ISO-8601, devuelve la fecha del lunes de
// esa semana (las semanas ISO siempre van de lunes a domingo).
function getMondayFromIsoWeek(isoYear, isoWeek) {
  const jan4 = new Date(Date.UTC(isoYear, 0, 4));
  const jan4Day = jan4.getUTCDay() || 7;
  const week1Monday = new Date(jan4);
  week1Monday.setUTCDate(jan4.getUTCDate() - jan4Day + 1);
  const monday = new Date(week1Monday);
  monday.setUTCDate(week1Monday.getUTCDate() + (isoWeek - 1) * 7);
  return monday;
}

// Devuelve el string "AAAA-Www" (formato del <input type="week">) para una fecha dada.
function getIsoWeekString(date) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
  return `${d.getUTCFullYear()}-W${String(weekNo).padStart(2, '0')}`;
}

// Calcula el rango de fechas [from, to] (YYYY-MM-DD) según el tipo de
// periodo elegido en los reportes.
function getPeriodRange(periodType, refs) {
  const today = todayISODate();
  if (periodType === 'dia') {
    const d = refs.dia || today;
    return { from: d, to: d };
  }
  if (periodType === 'semana') {
    const weekStr = refs.semana || getIsoWeekString(new Date());
    const [yearStr, weekPart] = weekStr.split('-W');
    const monday = getMondayFromIsoWeek(Number(yearStr), Number(weekPart));
    const sunday = new Date(monday);
    sunday.setUTCDate(monday.getUTCDate() + 6);
    const fmt = d => d.toISOString().slice(0, 10);
    return { from: fmt(monday), to: fmt(sunday) };
  }
  if (periodType === 'mes') {
    const [y, mo] = (refs.mes || today.slice(0, 7)).split('-').map(Number);
    const first = new Date(y, mo - 1, 1);
    const last = new Date(y, mo, 0);
    return { from: first.toISOString().slice(0, 10), to: last.toISOString().slice(0, 10) };
  }
  // Rango personalizado
  return { from: refs.desde || today, to: refs.hasta || today };
}

// -------- Reporte A: Movimientos por periodo --------

function generateMovementsReport(filters) {
  const { from, to } = getPeriodRange(filters.periodType, filters);
  const permCentro = getReportPermissionCentro();

  let data = visibleMovements().filter(m => m.date >= from && m.date <= to);

  if (permCentro) {
    data = data.filter(m =>
      (m.sender || '').toUpperCase() === permCentro || (m.destination || '').toUpperCase() === permCentro
    );
  } else if (filters.centro) {
    data = data.filter(m => m.sender === filters.centro || m.destination === filters.centro);
  }

  if (filters.docType) data = data.filter(m => (m.docType || 'Guía') === filters.docType);
  if (filters.verification) data = data.filter(m => normalizeVerification(m.verification) === filters.verification);
  if (filters.driver) data = data.filter(m => m.driver === filters.driver);
  if (filters.plate) data = data.filter(m => m.vehiclePlate === filters.plate);
  if (filters.machineQuery) {
    const q = filters.machineQuery.toLowerCase();
    data = data.filter(m => (m.machine || '').toLowerCase().includes(q));
  }

  return data.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : (b.id || 0) - (a.id || 0)));
}

function summarizeMovements(data) {
  const summary = { total: data.length, porEstado: {}, porEmisor: {}, porDestino: {} };
  data.forEach(m => {
    const estado = getReceptionStatus(m);
    summary.porEstado[estado] = (summary.porEstado[estado] || 0) + 1;
    summary.porEmisor[m.sender] = (summary.porEmisor[m.sender] || 0) + 1;
    summary.porDestino[m.destination] = (summary.porDestino[m.destination] || 0) + 1;
  });
  return summary;
}

function renderMovementsReportSummary(summary) {
  const el = document.querySelector('#repMovimientosSummary');
  if (!el) return;
  const estadoLines = Object.entries(summary.porEstado).map(([k, v]) => `${k}: ${v}`).join(' · ') || 'Sin datos';
  const emisorLines = Object.entries(summary.porEmisor).map(([k, v]) => `${k}: ${v}`).join(' · ') || 'Sin datos';
  const destinoLines = Object.entries(summary.porDestino).map(([k, v]) => `${k}: ${v}`).join(' · ') || 'Sin datos';
  el.innerHTML = `
    <div class="report-summary-card"><span>Total de movimientos</span><strong>${summary.total}</strong></div>
    <div class="report-summary-card"><span>Por estado</span><div class="report-summary-breakdown">${estadoLines}</div></div>
    <div class="report-summary-card"><span>Por centro emisor</span><div class="report-summary-breakdown">${emisorLines}</div></div>
    <div class="report-summary-card"><span>Por centro destino</span><div class="report-summary-breakdown">${destinoLines}</div></div>
  `;
}

function renderMovementsReportTable(data) {
  const tbody = document.querySelector('#repMovimientosRows');
  if (!tbody) return;
  tbody.innerHTML = data.map(m => `
    <tr>
      <td>${formatDate(m.date)}</td>
      <td>${m.docType || 'Guía'}</td>
      <td>${m.guide}</td>
      <td>${m.machine}</td>
      <td>${m.sender}</td>
      <td>${m.destination}</td>
      <td>${m.driver}</td>
      <td>${m.vehiclePlate || '-'}</td>
      <td>${getReceptionStatus(m)}</td>
      <td>${m.receivedDate ? formatDate(m.receivedDate) : '-'}</td>
      <td>${m.verifiedBy ? getUserFullName(m.verifiedBy) : '-'}</td>
      <td>${getUserFullName(m.createdBy)}</td>
    </tr>
  `).join('') || '<tr><td colspan="12" style="text-align:center;color:var(--muted);">Sin movimientos para los filtros seleccionados.</td></tr>';
}

let lastMovementsReport = [];

function handleGenerateMovementsReport() {
  const filters = {
    periodType: document.querySelector('#repPeriodType').value,
    dia: document.querySelector('#repDia').value,
    semana: document.querySelector('#repSemana').value,
    mes: document.querySelector('#repMes').value,
    desde: document.querySelector('#repDesde').value,
    hasta: document.querySelector('#repHasta').value,
    centro: document.querySelector('#repCentro').value,
    docType: document.querySelector('#repDocType').value,
    verification: document.querySelector('#repVerification').value,
    driver: document.querySelector('#repDriver').value,
    plate: document.querySelector('#repPlate').value,
    machineQuery: document.querySelector('#repMachineQuery').value.trim()
  };
  lastMovementsReport = generateMovementsReport(filters);
  renderMovementsReportSummary(summarizeMovements(lastMovementsReport));
  renderMovementsReportTable(lastMovementsReport);
}

function exportMovementsReport() {
  const headers = ['fecha', 'tipo_documento', 'numero_documento', 'maquinaria', 'emisor', 'destino', 'chofer', 'patente', 'estado', 'fecha_recepcion', 'recepcionado_por', 'cargado_por'];
  const lines = [headers.join(',')].concat(
    lastMovementsReport.map(m => [
      m.date, m.docType || 'Guía', m.guide, m.machine, m.sender, m.destination, m.driver, m.vehiclePlate || '',
      getReceptionStatus(m), m.receivedDate || '', m.verifiedBy ? getUserFullName(m.verifiedBy) : '', getUserFullName(m.createdBy)
    ].map(v => '"' + String(v || '').replaceAll('"', '""') + '"').join(','))
  );
  const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'reporte-movimientos.csv';
  link.click();
  URL.revokeObjectURL(url);
}

// -------- Reporte B: Maquinaria por Centro de Trabajo --------

// Determina, para cada máquina del historial (y del catálogo), su estado
// actual: 'Ubicado' (recepcionada en un centro), 'En tránsito' (movimiento
// más reciente aún no verificado) o 'Sin registro de recepción' (nunca
// tuvo un movimiento verificado). Ver reglas RN-B1 a RN-B3 del diseño.
function computeMachineLocations(asOfDate) {
  const byMachine = new Map();

  movements.forEach(m => {
    if (asOfDate && m.date > asOfDate) return;
    splitMachineLabels(m.machine).forEach(label => {
      const parsed = parseMachineLabel(label);
      if (!byMachine.has(parsed.key)) byMachine.set(parsed.key, []);
      byMachine.get(parsed.key).push({ m, parsed });
    });
  });

  // Asegura que las máquinas del catálogo sin ningún movimiento también aparezcan.
  maquinaria.forEach(item => {
    const key = item.codigo || item.descripcion;
    if (!byMachine.has(key)) byMachine.set(key, []);
  });

  const results = [];
  byMachine.forEach((entries, key) => {
    if (!entries.length) {
      const catalogItem = maquinaria.find(x => (x.codigo || x.descripcion) === key);
      results.push({
        codigo: catalogItem ? (catalogItem.codigo || '-') : key,
        descripcion: catalogItem ? catalogItem.descripcion : key,
        estado: 'Sin registro de recepción',
        centro: null, origen: null, destino: null, documento: null, fechaRecepcion: null
      });
      return;
    }

    entries.sort((a, b) => (a.m.date < b.m.date ? 1 : a.m.date > b.m.date ? -1 : (b.m.id || 0) - (a.m.id || 0)));
    const latest = entries[0];
    const verification = normalizeVerification(latest.m.verification);
    const documento = `${latest.m.docType || 'Guía'} ${latest.m.guide}`;

    if (verification === 'Verificado') {
      results.push({
        codigo: latest.parsed.codigo || '-',
        descripcion: latest.parsed.descripcion,
        estado: 'Ubicado',
        centro: latest.m.destination,
        origen: null, destino: null,
        documento, fechaRecepcion: latest.m.receivedDate
      });
    } else {
      const lastVerified = entries.find(e => normalizeVerification(e.m.verification) === 'Verificado');
      results.push({
        codigo: latest.parsed.codigo || '-',
        descripcion: latest.parsed.descripcion,
        estado: 'En tránsito',
        centro: null,
        origen: lastVerified ? lastVerified.m.destination : (latest.m.sender || null),
        destino: latest.m.destination,
        documento, fechaRecepcion: null
      });
    }
  });

  return results;
}

function generateMaquinariaReport(filters) {
  const permCentro = getReportPermissionCentro();
  let data = computeMachineLocations(filters.asOfDate);

  if (filters.machineQuery) {
    const q = filters.machineQuery.toLowerCase();
    data = data.filter(r => (r.codigo || '').toLowerCase().includes(q) || (r.descripcion || '').toLowerCase().includes(q));
  }

  if (permCentro) {
    // RN-06 / RN-07: un Usuario normal solo ve su propio centro de trabajo, y
    // las máquinas "sin registro de recepción" no pertenecen a ningún centro.
    data = data.filter(r => {
      if (r.estado === 'Ubicado') return (r.centro || '').toUpperCase() === permCentro;
      if (r.estado === 'En tránsito') return (r.origen || '').toUpperCase() === permCentro || (r.destino || '').toUpperCase() === permCentro;
      return false;
    });
  } else if (filters.centro) {
    data = data.filter(r => {
      if (r.estado === 'Ubicado') return r.centro === filters.centro;
      if (r.estado === 'En tránsito') return r.origen === filters.centro || r.destino === filters.centro;
      return false;
    });
  }

  if (!filters.incluirTransito) {
    data = data.filter(r => r.estado !== 'En tránsito');
  }

  return data;
}

function summarizeByCentro(data) {
  const map = new Map();
  data.forEach(r => {
    if (r.estado !== 'Ubicado') return;
    if (!map.has(r.centro)) map.set(r.centro, { centro: r.centro, cantidad: 0, ultimaFecha: null });
    const entry = map.get(r.centro);
    entry.cantidad += 1;
    if (r.fechaRecepcion && (!entry.ultimaFecha || r.fechaRecepcion > entry.ultimaFecha)) entry.ultimaFecha = r.fechaRecepcion;
  });
  return Array.from(map.values()).sort((a, b) => a.centro.localeCompare(b.centro));
}

function renderMaquinariaReportSummary(data) {
  const el = document.querySelector('#repMaquinariaSummary');
  if (!el) return;
  const porCentro = summarizeByCentro(data);
  const enTransito = data.filter(r => r.estado === 'En tránsito').length;
  const sinRegistro = data.filter(r => r.estado === 'Sin registro de recepción').length;
  const cards = porCentro.map(c => `
    <div class="report-summary-card">
      <span>${c.centro}</span>
      <strong>${c.cantidad}</strong>
      <div class="report-summary-breakdown">${c.ultimaFecha ? 'Última recepción: ' + formatDate(c.ultimaFecha) : ''}</div>
    </div>
  `).join('');
  el.innerHTML = cards + `
    <div class="report-summary-card"><span>En tránsito</span><strong>${enTransito}</strong></div>
    <div class="report-summary-card"><span>Sin registro de recepción</span><strong>${sinRegistro}</strong></div>
  `;
}

function renderMaquinariaReportTable(data) {
  const tbody = document.querySelector('#repMaquinariaRows');
  if (!tbody) return;
  tbody.innerHTML = data.map(r => {
    let centroCol = '-';
    if (r.estado === 'Ubicado') centroCol = r.centro;
    else if (r.estado === 'En tránsito') centroCol = `${r.origen || '?'} → ${r.destino || '?'}`;
    return `
      <tr>
        <td>${r.codigo || '-'}</td>
        <td>${r.descripcion}</td>
        <td>${r.estado}</td>
        <td>${centroCol}</td>
        <td>${r.documento || '-'}</td>
        <td>${r.fechaRecepcion ? formatDate(r.fechaRecepcion) : '-'}</td>
      </tr>`;
  }).join('') || '<tr><td colspan="6" style="text-align:center;color:var(--muted);">Sin resultados para los filtros seleccionados.</td></tr>';
}

let lastMaquinariaReport = [];

function handleGenerateMaquinariaReport() {
  const periodType = document.querySelector('#repMaqPeriodType').value;
  const { to: asOfDate } = getPeriodRange(periodType, {
    dia: document.querySelector('#repMaqDia').value,
    semana: document.querySelector('#repMaqSemana').value,
    mes: document.querySelector('#repMaqMes').value,
    desde: document.querySelector('#repMaqDesde').value,
    hasta: document.querySelector('#repMaqHasta').value
  });
  const filters = {
    centro: document.querySelector('#repMaqCentro').value,
    machineQuery: document.querySelector('#repMaqQuery').value.trim(),
    asOfDate,
    incluirTransito: document.querySelector('#repMaqTransito').checked
  };
  lastMaquinariaReport = generateMaquinariaReport(filters);
  renderMaquinariaReportSummary(lastMaquinariaReport);
  renderMaquinariaReportTable(lastMaquinariaReport);
}

function exportMaquinariaReport() {
  const headers = ['codigo', 'descripcion', 'estado', 'centro_de_costo', 'documento', 'fecha_recepcion'];
  const lines = [headers.join(',')].concat(
    lastMaquinariaReport.map(r => {
      let centroCol = '-';
      if (r.estado === 'Ubicado') centroCol = r.centro;
      else if (r.estado === 'En tránsito') centroCol = `${r.origen || '?'} -> ${r.destino || '?'}`;
      return [r.codigo || '', r.descripcion, r.estado, centroCol, r.documento || '', r.fechaRecepcion || '']
        .map(v => '"' + String(v || '').replaceAll('"', '""') + '"').join(',');
    })
  );
  const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'reporte-maquinaria-por-centro-de-costo.csv';
  link.click();
  URL.revokeObjectURL(url);
}

// -------- UI: filtros, sub-tabs y restricción por permisos --------

// Pobla los <select> de filtros (centro de trabajo, chofer, patente) y, si el
// usuario no es Administrador, fija/oculta el filtro de centro de trabajo a su
// propio centro asignado (RN-06).
function populateReportFilterOptions() {
  const centroSelects = [document.querySelector('#repCentro'), document.querySelector('#repMaqCentro')];
  const permCentro = getReportPermissionCentro();

  centroSelects.forEach(sel => {
    if (!sel) return;
    const current = sel.value;
    if (permCentro) {
      sel.innerHTML = `<option value="${currentUser.centroCostoAsignado}">${currentUser.centroCostoAsignado}</option>`;
      sel.value = currentUser.centroCostoAsignado;
      sel.disabled = true;
    } else {
      sel.disabled = false;
      sel.innerHTML = '<option value="">Todos</option>' + centrosCosto.map(c => `<option value="${c.nombre}">${c.nombre}</option>`).join('');
      if (centrosCosto.some(c => c.nombre === current)) sel.value = current;
    }
  });

  const driverSelect = document.querySelector('#repDriver');
  if (driverSelect) {
    const current = driverSelect.value;
    driverSelect.innerHTML = '<option value="">Todos</option>' + choferes.map(c => {
      const label = driverLabel(c);
      return `<option value="${label}">${label}</option>`;
    }).join('');
    driverSelect.value = current;
  }

  const plateSelect = document.querySelector('#repPlate');
  if (plateSelect) {
    const current = plateSelect.value;
    plateSelect.innerHTML = '<option value="">Todas</option>' + vehiculos.map(v => `<option value="${v.plate}">${v.plate}</option>`).join('');
    plateSelect.value = current;
  }
}

function switchReportTab(tab) {
  const isMovimientos = tab === 'movimientos';
  document.querySelector('#reportMovimientosPanel').style.display = isMovimientos ? '' : 'none';
  document.querySelector('#reportMaquinariaPanel').style.display = isMovimientos ? 'none' : '';
  document.querySelector('#reportTabMovimientos').classList.toggle('active', isMovimientos);
  document.querySelector('#reportTabMaquinaria').classList.toggle('active', !isMovimientos);
}

function updatePeriodTypeVisibility(prefix) {
  const type = document.querySelector(`#${prefix}PeriodType`).value;
  document.querySelector(`#${prefix}DiaWrap`).style.display = type === 'dia' ? '' : 'none';
  document.querySelector(`#${prefix}SemanaWrap`).style.display = type === 'semana' ? '' : 'none';
  document.querySelector(`#${prefix}MesWrap`).style.display = type === 'mes' ? '' : 'none';
  document.querySelector(`#${prefix}DesdeWrap`).style.display = type === 'rango' ? '' : 'none';
  document.querySelector(`#${prefix}HastaWrap`).style.display = type === 'rango' ? '' : 'none';
}

function exportCsv() {

  const headers = ['id', 'fecha', 'tipo_documento', 'numero_documento', 'maquinaria', 'emisor', 'destino', 'verificacion', 'verificado_por', 'fecha_recepcion', 'recepcion', 'chofer', 'patente', 'nota', 'cargado_por', 'modificado_por', 'fecha_modificacion', 'estado'];
  const lines = [headers.join(',')].concat(
    visibleMovements().map(m => {
      const noteVal = canReadNote(m) ? (m.note || '') : '🔒 Oculto';
      return [
        m.id,
        m.date,
        m.docType || 'Guía',
        m.guide,
        m.machine,
        m.sender,
        m.destination,
        normalizeVerification(m.verification),
        m.verifiedBy || '',
        m.receivedDate || '',
        getReceptionStatus(m),
        m.driver,
        m.vehiclePlate || '',
        noteVal,
        getUserFullName(m.createdBy),
        m.modifiedBy || '',
        m.modifiedAt || '',
        getStatus(m)
      ].map(v => '"' + String(v || '').replaceAll('"', '""') + '"').join(',');
    })
  );
  
  const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'seguimiento-maquinaria.csv';
  link.click();
  URL.revokeObjectURL(url);
}

// Users Management Functions
function renderUsers() {
  if (!currentUser || currentUser.role !== 'Administrador') return;

  const list = Object.values(users).sort((a, b) => a.username.localeCompare(b.username));

  dom.userRows.innerHTML = list.map(u => {
    const isSelf = u.username === currentUser.username;
    const deleteBtn = isSelf
      ? `<button class="action-btn delete-btn" style="opacity: 0.5; cursor: not-allowed;" title="No puedes eliminarte a ti mismo" type="button" disabled>Eliminar</button>`
      : `<button class="action-btn delete-btn" onclick="handleDeleteUser('${u.username}')" type="button">Eliminar</button>`;

    const fullName = `${u.firstName || ''} ${u.lastName || ''}`.trim() || u.name || 'Sin nombre';
    return `<tr>
      <td style="font-weight: 600;">${u.username}</td>
      <td>${fullName}</td>
      <td>${u.centroCostoAsignado || '-'}</td>
      <td>${u.email || '-'}</td>
      <td><span class="status-pill ${u.role === 'Administrador' ? 'status-workshop' : 'status-field'}">${u.role}</span></td>
      <td class="action-cell">
        <div class="action-btn-group">
          <button class="action-btn edit-btn" onclick="openEditUserForm('${u.username}')" type="button">Editar</button>
          ${deleteBtn}
        </div>
      </td>
    </tr>`;
  }).join('');
}

function populateUserFormSelects() {
  if (dom.userFormCentroCostoSelect) {
    dom.userFormCentroCostoSelect.innerHTML = centrosCosto.map(c => `<option value="${c.nombre}">${c.nombre}</option>`).join('');
  }
}

function openEditUserForm(username) {
  const user = users[username];
  if (!user) return;

  editingUsername = username;
  dom.userFormTitle.textContent = 'Editar usuario';
  dom.userFormUsername.value = user.username;
  dom.userFormUsername.disabled = true; // Key field, read-only

  populateUserFormSelects();

  dom.userForm.elements.firstName.value = user.firstName || '';
  dom.userForm.elements.lastName.value = user.lastName || '';
  dom.userForm.elements.centroCostoAsignado.value = user.centroCostoAsignado || '';
  dom.userForm.elements.email.value = user.email || '';
  dom.userForm.elements.pass.value = user.pass;
  dom.userForm.elements.role.value = user.role;

  dom.userFormCancel.style.display = 'inline-block';
  dom.userFormMessage.textContent = '';
}

function resetUserForm() {
  dom.userForm.reset();
  dom.userFormUsername.disabled = false;
  dom.userFormTitle.textContent = 'Crear usuario';
  dom.userFormCancel.style.display = 'none';
  dom.userFormMessage.textContent = '';
  editingUsername = null;
  populateUserFormSelects();
}

// La función handleSubmitUser duplicada e inconsistente que estaba aquí ha sido eliminada.
// Toda la lógica corregida y con estilos de feedback de usuario se centralizó arriba.

function handleDeleteUser(username) {
  if (!currentUser || currentUser.role !== 'Administrador') return;
  if (username === currentUser.username) {
    alert('No puedes eliminar tu propio usuario.');
    return;
  }

  const confirmDelete = confirm(`¿Está seguro de que desea eliminar el usuario "${username}"?`);
  if (confirmDelete) {
    delete users[username];
    saveUsers();
    renderUsers();

    if (editingUsername === username) {
      resetUserForm();
    }
  }
}

// Global scope attachment for click handlers in dynamic HTML rows
window.openEditDrawer = openEditDrawer;
window.openDetailDrawer = openDetailDrawer;
window.handleDelete = handleDelete;
window.handleVerificationChange = handleVerificationChange;
window.openEditUserForm = openEditUserForm;
window.handleDeleteUser = handleDeleteUser;
window.handleDeleteCatalogItem = handleDeleteCatalogItem;
window.startEditCentroCosto = startEditCentroCosto;
window.startEditDriver = startEditDriver;
window.startEditVehicle = startEditVehicle;
window.startEditMaquinaria = startEditMaquinaria;

// Render profile page content
function renderProfile() {
  if (!currentUser) return;
  const fullName = `${currentUser.firstName || ''} ${currentUser.lastName || ''}`.trim() || currentUser.name || 'Sin nombre';
  
  if (dom.profileFullName) dom.profileFullName.textContent = fullName;
  if (dom.profileAvatar) dom.profileAvatar.textContent = currentUser.username.charAt(0).toUpperCase();
  if (dom.profileRoleText) {
    dom.profileRoleText.textContent = currentUser.role;
    dom.profileRoleText.className = `status-pill ${currentUser.role === 'Administrador' ? 'status-workshop' : 'status-field'}`;
  }
  if (dom.profileUsername) dom.profileUsername.textContent = currentUser.username;
  if (dom.profileEmail) dom.profileEmail.textContent = currentUser.email || 'No registrado';
  if (dom.profileCentroCosto) dom.profileCentroCosto.textContent = currentUser.centroCostoAsignado || 'No asignado';
}

// MEJORA 4: pequeño badge en el Dashboard del Administrador que resume el
// registro de auditoría de recuperación de contraseñas (mismo storage que
// usa renderRecoveryAudit(), en la vista Usuarios) para que el Admin note de
// un vistazo si hay solicitudes de soporte de credenciales.
function renderPasswordAuditBadge() {
  if (!dom.adminAuditBadge) return;
  if (!currentUser || currentUser.role !== 'Administrador') return;

  const auditLog = JSON.parse(localStorage.getItem('seguimiento-maquinaria-auditoria-recuperacion') || '[]');
  const pendingCount = auditLog.filter(e => e.status === 'Solicitado').length;

  dom.adminAuditBadge.style.background = pendingCount ? '#fff3e0' : '#edf4f1';
  dom.adminAuditBadge.style.color = pendingCount ? '#8a4a08' : 'var(--teal-dark)';
  dom.adminAuditBadge.innerHTML = `🔑 <strong>${pendingCount}</strong>&nbsp;solicitud${pendingCount === 1 ? '' : 'es'} de clave pendiente${pendingCount === 1 ? '' : 's'}`;
}

// Render password recovery audit logs (Admin only)
function renderRecoveryAudit() {
  if (!currentUser || currentUser.role !== 'Administrador' || !dom.recoveryAuditRows) return;
  const auditLog = JSON.parse(localStorage.getItem('seguimiento-maquinaria-auditoria-recuperacion') || '[]');
  
  if (auditLog.length === 0) {
    dom.recoveryAuditRows.innerHTML = `<tr><td colspan="5" style="text-align: center; color: var(--muted); padding: 12px;">No hay solicitudes registradas</td></tr>`;
    return;
  }
  
  const sorted = [...auditLog].sort((a, b) => b.date.localeCompare(a.date));
  
  dom.recoveryAuditRows.innerHTML = sorted.map(entry => {
    const formattedDate = formatDate(entry.date.split('T')[0]);
    const formattedTime = entry.date.split('T')[1] ? entry.date.split('T')[1].substring(0, 5) : '';
    return `<tr>
      <td>${formattedDate} ${formattedTime}</td>
      <td style="font-weight: 600;">${entry.username}</td>
      <td>${entry.email}</td>
      <td>${entry.area || '-'}</td>
      <td><span class="status-pill status-pending">${entry.status}</span></td>
    </tr>`;
  }).join('');
}

// Password Recovery Handlers
function handleRecoverySubmit(event) {
  event.preventDefault();
  const input = dom.recoveryInput.value.trim().toLowerCase();
  
  // Buscar usuario
  const user = Object.values(users).find(u => 
    u.username.toLowerCase() === input || 
    (u.email && u.email.toLowerCase() === input)
  );

  dom.recoveryMessage.hidden = false;
  if (user) {
    // Almacenar registro auditable
    const auditLog = JSON.parse(localStorage.getItem('seguimiento-maquinaria-auditoria-recuperacion') || '[]');
    const entry = {
      id: 'REC-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
      date: new Date().toISOString(),
      username: user.username,
      email: user.email || 'correo@maquinaria.cl',
      area: user.centroCostoAsignado || '-',
      status: 'Solicitado'
    };
    auditLog.push(entry);
    localStorage.setItem('seguimiento-maquinaria-auditoria-recuperacion', JSON.stringify(auditLog));
    
    // UI Feedback
    dom.recoveryMessage.textContent = 'Solicitud registrada. Contacte al Administrador para restablecer su clave.';
    dom.recoveryMessage.style.color = 'var(--teal)';
    dom.recoveryMessage.style.backgroundColor = '#e9f4ee';
    dom.recoveryMessage.style.border = '1px solid rgba(18,107,99,0.15)';
  } else {
    dom.recoveryMessage.textContent = 'No se encontró ningún usuario con ese nombre o correo.';
    dom.recoveryMessage.style.color = 'var(--red)';
    dom.recoveryMessage.style.backgroundColor = '#fff5f4';
    dom.recoveryMessage.style.border = '1px solid rgba(184,61,53,0.15)';
  }
}

// Event Listeners Configuration
dom.navItems.forEach(button => button.addEventListener('click', () => switchView(button.dataset.view)));
document.querySelectorAll('[data-view-switch]').forEach(button => button.addEventListener('click', () => switchView(button.dataset.viewSwitch)));
[dom.searchInput, dom.fromDate, dom.toDate].forEach(input => input.addEventListener('input', renderTables));
dom.openForm.addEventListener('click', openDrawer);
dom.closeForm.addEventListener('click', closeDrawer);
dom.drawerBackdrop.addEventListener('click', closeAnyDrawer);
if (dom.closeDetail) dom.closeDetail.addEventListener('click', closeDetailDrawer);
dom.form.addEventListener('submit', handleSubmit);
if (dom.formDocTypeSelect) dom.formDocTypeSelect.addEventListener('change', updateDocTypeFieldVisibility);
if (dom.formGuideInput) dom.formGuideInput.addEventListener('input', () => sanitizeDocNumberInput(dom.formGuideInput));
if (dom.formMemoInput) dom.formMemoInput.addEventListener('input', () => sanitizeDocNumberInput(dom.formMemoInput));

// Combobox de selección múltiple (máx. 5) con filtro de texto para el campo Maquinaria.
if (dom.formMachineSearch) {
  dom.formMachineSearch.addEventListener('focus', openMachineList);
  dom.formMachineSearch.addEventListener('input', openMachineList);
  dom.formMachineSearch.addEventListener('keydown', handleMachineListKeydown);
  dom.formMachineSearch.addEventListener('blur', () => {
    // Pequeño retraso para permitir que el mousedown sobre una opción se
    // procese antes de cerrar la lista.
    setTimeout(closeMachineList, 150);
  });
}
if (dom.formMachineList) {
  // mousedown (no click) para que dispare antes que el blur del input de búsqueda.
  dom.formMachineList.addEventListener('mousedown', (event) => {
    const option = event.target.closest('.combobox-option');
    if (!option) return;
    event.preventDefault();
    toggleMachineOption(option.dataset.value);
  });
}
const formMachineChipsEl = document.querySelector('#formMachineChips');
if (formMachineChipsEl) {
  formMachineChipsEl.addEventListener('click', (event) => {
    const removeBtn = event.target.closest('.machine-chip-remove');
    if (!removeBtn) return;
    removeMachineSelection(removeBtn.dataset.value);
  });
}

dom.exportCsv.addEventListener('click', exportCsv);

// -------- Listeners del módulo de Reportería --------
document.querySelector('#reportTabMovimientos').addEventListener('click', () => switchReportTab('movimientos'));
document.querySelector('#reportTabMaquinaria').addEventListener('click', () => switchReportTab('maquinaria'));
document.querySelector('#repPeriodType').addEventListener('change', () => updatePeriodTypeVisibility('rep'));
document.querySelector('#repMaqPeriodType').addEventListener('change', () => updatePeriodTypeVisibility('repMaq'));
document.querySelector('#generarReporteMovimientos').addEventListener('click', handleGenerateMovementsReport);
document.querySelector('#exportReporteMovimientos').addEventListener('click', exportMovementsReport);
document.querySelector('#generarReporteMaquinaria').addEventListener('click', handleGenerateMaquinariaReport);
document.querySelector('#exportReporteMaquinaria').addEventListener('click', exportMaquinariaReport);
updatePeriodTypeVisibility('rep');
updatePeriodTypeVisibility('repMaq');
document.querySelector('#repDia').value = todayISODate();
document.querySelector('#repMaqDia').value = todayISODate();
document.querySelector('#repSemana').value = getIsoWeekString(new Date());
document.querySelector('#repMaqSemana').value = getIsoWeekString(new Date());

// MEJORA 1: recalcular métricas del Dashboard al cambiar Periodo o Ubicación.
if (dom.dashboardPeriodFilter) dom.dashboardPeriodFilter.addEventListener('change', renderMetrics);
if (dom.dashboardLocationFilter) dom.dashboardLocationFilter.addEventListener('change', renderMetrics);

// MEJORA 2: acciones rápidas del Dashboard (solo Administrador).
// a) "Cargar Excel de Maquinarias" → lleva a la vista Maquinaria y enfoca el
//    input de carga de archivo (#maquinariaFileInput) para continuar el flujo.
function quickActionUploadMaquinaria() {
  if (!currentUser || currentUser.role !== 'Administrador') return;
  switchView('maquinaria');
  setTimeout(() => {
    const fileInput = document.querySelector('#maquinariaFileInput');
    if (fileInput) {
      fileInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
      fileInput.focus();
    }
  }, 60);
}
// b) "Registrar nuevo usuario" → lleva a la vista Usuarios, se asegura de que
//    el formulario esté en modo "Crear" (no "Editar") y enfoca el primer campo.
function quickActionRegisterUser() {
  if (!currentUser || currentUser.role !== 'Administrador') return;
  switchView('users');
  resetUserForm();
  setTimeout(() => {
    const firstNameInput = dom.userForm && dom.userForm.elements.firstName;
    if (firstNameInput) {
      firstNameInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
      firstNameInput.focus();
    }
  }, 60);
}
if (dom.quickUploadMaquinariaBtn) dom.quickUploadMaquinariaBtn.addEventListener('click', quickActionUploadMaquinaria);
if (dom.quickRegisterUserBtn) dom.quickRegisterUserBtn.addEventListener('click', quickActionRegisterUser);

// Users Form Events
dom.userForm.addEventListener('submit', handleSubmitUser);
dom.userFormCancel.addEventListener('click', resetUserForm);

// Login Event Listeners
dom.loginForm.addEventListener('submit', handleLogin);
dom.logoutBtn.addEventListener('click', handleLogout);

// Password Recovery Navigation & Submit
dom.showRecoveryBtn.addEventListener('click', () => {
  dom.loginForm.style.display = 'none';
  dom.recoveryForm.style.display = 'grid';
  dom.loginCardTitle.textContent = 'Recuperar contraseña';
  dom.loginCardSubtitle.textContent = 'Solicite el restablecimiento de su clave';
  dom.recoveryInput.value = '';
  dom.recoveryMessage.hidden = true;
});

dom.backToLoginBtn.addEventListener('click', () => {
  dom.recoveryForm.style.display = 'none';
  dom.loginForm.style.display = 'grid';
  dom.loginCardTitle.textContent = '¡Hola!';
  dom.loginCardSubtitle.textContent = 'Inicia sesión para registrar movimientos';
});

dom.recoveryForm.addEventListener('submit', handleRecoverySubmit);

// Admin Recovery Audit Logs Clear
if (dom.clearRecoveryAuditBtn) {
  dom.clearRecoveryAuditBtn.addEventListener('click', () => {
    if (confirm('¿Está seguro de que desea limpiar todo el historial de auditoría de recuperación?')) {
      localStorage.removeItem('seguimiento-maquinaria-auditoria-recuperacion');
      renderRecoveryAudit();
    }
  });
}

// Admin Catalogs Form Events
const addCentroCostoBtn = document.querySelector('#addCentroCostoBtn');
const addDriverBtn = document.querySelector('#addDriverBtn');
const addVehicleBtn = document.querySelector('#addVehicleBtn');
const addMaquinariaBtn = document.querySelector('#addMaquinariaBtn');
const uploadMaquinariaBtn = document.querySelector('#uploadMaquinariaBtn');
const cancelCentroCostoEditBtn = document.querySelector('#cancelCentroCostoEdit');
const cancelDriverEditBtn = document.querySelector('#cancelDriverEdit');
const cancelVehicleEditBtn = document.querySelector('#cancelVehicleEdit');
const cancelMaquinariaEditBtn = document.querySelector('#cancelMaquinariaEdit');

if (addCentroCostoBtn) addCentroCostoBtn.addEventListener('click', () => handleAddCatalogItem('centroCosto'));
if (addDriverBtn) addDriverBtn.addEventListener('click', () => handleAddCatalogItem('chofer'));
if (addVehicleBtn) addVehicleBtn.addEventListener('click', () => handleAddCatalogItem('vehiculo'));
if (addMaquinariaBtn) addMaquinariaBtn.addEventListener('click', () => handleAddCatalogItem('maquinaria'));
if (uploadMaquinariaBtn) uploadMaquinariaBtn.addEventListener('click', handleMaquinariaExcelUpload);
if (cancelCentroCostoEditBtn) cancelCentroCostoEditBtn.addEventListener('click', cancelCentroCostoEdit);
if (cancelDriverEditBtn) cancelDriverEditBtn.addEventListener('click', cancelDriverEdit);
if (cancelVehicleEditBtn) cancelVehicleEditBtn.addEventListener('click', cancelVehicleEdit);
if (cancelMaquinariaEditBtn) cancelMaquinariaEditBtn.addEventListener('click', cancelMaquinariaEdit);

// Show/hide catalog admin forms via catalog-view "+" button (same element as form)
// The forms are always visible to admin (shown via updateSessionUI)

// Initial Execution
updateSessionUI();
renderAll();
if (currentUser) startInactivityMonitor();

// Ya se determinó si hay sesión activa o no (y se mostró login o dashboard
// según corresponda): recién ahora se quita la pantalla de carga, para que
// nunca se alcance a ver un "flash" del login de forma incorrecta.
const appLoadingOverlay = document.querySelector('#appLoadingOverlay');
if (appLoadingOverlay) appLoadingOverlay.style.display = 'none';