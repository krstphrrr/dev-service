/* 2022-02-15-CMF:
  Usage:
    ./queries.ts
      QueryGenerator.getSelectorWhereConditions() 
*/
export const filterQueryParametersToColumns: { [key: string]: string } = {
  'primaryKey': "PrimaryKey",
  // 2022-02-15-CMF: Selectors and corresponding database columns
  'landCoverName': 'modis_landcover',
  'ecoregionLevelI': 'na_l1name',
  'ecoregionLevelII': 'na_l2name',
  'ecoregionLevelIII': 'us_l3name',
  'ecoregionLevelIV': 'us_l4name',
  'ecologocalSiteId': 'EcologicalSiteId',
  'ecologicalSiteIdMlraCode': 'EcologicalSiteId',
  'ecologicalSiteIdSubMlraCode': 'EcologicalSiteId',
  'ecologicalSiteIdEcositeCode': 'EcologicalSiteId',
  'ecologicalSiteIdStateCode': 'EcologicalSiteId',
  'mlraSymbol': 'mlrarsym',
  'mlraName': 'mlra_name',
  'usState': 'State',
  'date':'DateVisited',
  'projectKey':'ProjectKey',
  // 2022-02-15-CMF: Indicators and corresponding database columns
  'percentBareGround':'BareSoilCover',
  'percentFoliarCover':'TotalFoliarCover',
  'percentLitterCover':'FH_TotalLitterCover',
  'percentRockFragmentCover':'FH_RockCover',
  'percentLichenCover':'FH_LichenCover',
  'percentCyanobacteriaCover':'FH_CyanobacteriaCover',
  'percentMossCover':'FH_MossCover',
  'meanWoodyHeight':'Hgt_Woody_Avg', 
  'meanHerbaceousHeight':'Hgt_Herbaceous_Avg',
  'percentCanopyGaps25to50':'GapCover_25_50',
  'percentCanopyGaps51to100':'GapCover_51_100',
  'percentCanopyGaps101to200':'GapCover_101_200',
  'percentCanopyGaps201plus':'GapCover_200_plus',
  'meanSoilStabilitySurface':'SoilStability_All',
  'meanSoilStabilityProtected':'SoilStability_Protected',
  'meanSoilStabilityUnprotected':'SoilStability_Unprotected'
}

export const gisDbTableNames = [
  'geoIndicators',
  'geoSpecies',
  'dataLPI',
  'dataGap',
  'dataHeight',
  'dataSpeciesInventory', 
  'dataSoilStability',
  // 'dataHorizontalFlux', // added for image dl_node:1.1.10
  // 'tblSchema' // added for image dl_node:1.1.10
]