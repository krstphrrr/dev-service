/* 2022-02-15-CMF:
  Usage:
    ./queries.ts
      QueryGenerator.getSelectorWhereConditions() 
*/
export const filterQueryParametersToColumns: { [key: string]: string } = {
  'primaryKey': "PrimaryKey",
  // 2022-02-15-CMF: Selectors and corresponding database columns
  'landCoverName': 'modis_landcover', // 2022-05-30-CMF: In public_dev // 2022-05-01-CMF: Not in public_dev
  'ecoregionLevelI': 'na_l1name', // 2022-05-30-CMF: In public_dev // 2022-05-01-CMF: Not in public_dev
  'ecoregionLevelII': 'na_l2name', // 2022-05-30-CMF: In public_dev // 2022-05-01-CMF: Not in public_dev
  'ecoregionLevelIII': 'us_l3name', // 2022-05-30-CMF: In public_dev // 2022-05-01-CMF: Not in public_dev
  'ecoregionLevelIV': 'us_l4name', // 2022-05-30-CMF: In public_dev // 2022-05-01-CMF: Not in public_dev
  'ecologocalSiteId': 'EcologicalSiteId',
  'ecologicalSiteIdMlraCode': 'EcologicalSiteId',
  'ecologicalSiteIdSubMlraCode': 'EcologicalSiteId',
  'ecologicalSiteIdEcositeCode': 'EcologicalSiteId',
  'ecologicalSiteIdStateCode': 'EcologicalSiteId',
  'mlraSymbol': 'mlrarsym', // 2022-05-30-CMF: In public_dev // 2022-05-01-CMF: Not in public_dev (as expected)
  'mlraName': 'mlra_name', // 2022-05-30-CMF: In public_dev // 2022-05-01-CMF: Not in public_dev
  'usState': 'State', // 2022-05-30-CMF: In public_dev // 2022-05-01-CMF: Not in public_dev
  'date':'DateVisited',
  // 2022-05-14-CMF: REMOVED 'projectName':'ProjectName', // 2022-05-01-CMF: Not in public_dev (as expected)
  // 'projectName':'ProjectName',
  // 2022-02-15-CMF: Indicators and corresponding database columns
  // 2022-05-26-CMF: Added projectKey entry for public_dev schema
  'projectKey': 'ProjectKey',
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
  'meanSoilStabilityUnprotected':'SoilStability_Unprotected',
    // 2022-08-29-CMF: Add following for AERO functionality
    'totalHorizontalFlux': 'horizontal_flux_total_MD',
    'totalVerticalFlux': 'vertical_flux_MD',
    'pm2p5VerticalFlux': 'PM2_5_MD',
    'pm10VerticalFlux': 'PM10_MD',
}

/* 2022-02-15-CMF:
  Usage:
    ./queries.ts
      QueryGenerator.getSelectorWhereConditions()
*/
export const ecoregionSelectors = [
  'ecoregionLevelI',
  'ecoregionLevelII',
  'ecoregionLevelIII',
  'ecoregionLevelIV'
]

/* 2022-02-15-CMF:
  Usage:
    ./queries.ts
      QueryGenerator.getSelectorWhereConditions() 
*/
export const ecologicalSiteSelectors = [
  'ecologicalSiteId',
  'ecologicalSiteIdMlraCode',
  'ecologicalSiteIdSubMlraCode', 
  'ecologicalSiteIdEcositeCode',
  'ecologicalSiteIdStateCode'
]

/* 2022-02-15-CMF:
  Usage:
    ./queries.ts
      QueryGenerator.getIndicatorWhereConditions() 
*/
export const indicatorQueryParameters = [
  'percentBareGround',
  'percentFoliarCover',
  'percentLitterCover',
  'percentRockFragmentCover',
  'percentLichenCover',
  'percentCyanobacteriaCover',
  'percentMossCover',
  'meanWoodyHeight',
  'meanHerbaceousHeight',
  'percentCanopyGaps25to50',
  'percentCanopyGaps51to100',
  'percentCanopyGaps101to200',
  'percentCanopyGaps201plus',
  'meanSoilStabilitySurface',
  'meanSoilStabilityProtected',
  'meanSoilStabilityUnprotected',
  // 2022-08-29-CMF: Add following for AERO functionality
  'totalHorizontalFlux',
  'totalVerticalFlux',
  'pm2p5VerticalFlux',
  'pm10VerticalFlux'
]

/* 2022-02-15-CMF:
  Usage:
    ./queries.ts
      QueryGenerator.isSelectorQueryParameter()
*/
export const selectorQueryParameters = [
  'landCoverName',
  'ecoregionLevelI',
  'ecoregionLevelII',
  'ecoregionLevelIII',
  'ecoregionLevelIV',
  'ecologicalSiteId',
  'ecologicalSiteIdMlraCode',
  'ecologicalSiteIdSubMlraCode',
  'ecologicalSiteIdEcositeCode',
  'ecologicalSiteIdStateCode',
  'mlraSymbol',
  'mlraName',
  'usState',
  'projectName',
  'date',
  'fieldMethod'
]