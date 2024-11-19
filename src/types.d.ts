export type StateMetric = number;

export type StateData = {
  name: string,
  fips: string,
  abbr: string,
  num_change_in_uninsured: StateMetric,
  perc_change_in_uninsured: StateMetric,
  num_change_in_marketplace_wPTC: StateMetric,
  perc_change_in_marketplace_wPTC: StateMetric,
  num_change_in_aca_compliant_nongroup: StateMetric,
  perc_change_in_aca_compliant_nongroup: StateMetric,
  num_change_in_ESI: StateMetric,
  perc_change_in_ESI: StateMetric,
  num_unins_138_FPL: StateMetric,
  perc_unins_138_FPL: StateMetric,
  num_marketplace_wPTC_138_FPL: StateMetric,
  perc_marketplace_wPTC_138_FPL: StateMetric,
  num_unins_138_200_FPL: StateMetric,
  perc_unins_138_200_FPL: StateMetric,
  num_marketplace_wPTC_138_200_FPL: StateMetric,
  perc_marketplace_wPTC_138_200_FPL: StateMetric,
  num_unins_200_400_FPL: StateMetric,
  perc_unins_200_400_FPL: StateMetric,
  num_marketplace_wPTC_200_400_FPL: StateMetric,
  perc_marketplace_wPTC_200_400_FPL: StateMetric,
  num_unins_400_FPL: StateMetric,
  perc_unins_400_FPL: StateMetric,
  num_marketplace_wPTC_400_FPL: StateMetric,
  perc_marketplace_wPTC_400_FPL: StateMetric,
  num_unins_children: StateMetric,
  perc_unins_children: StateMetric,
  num_marketplace_wPTC_children: StateMetric,
  perc_marketplace_wPTC_children: StateMetric,
  num_unins_age_19_34: StateMetric,
  perc_unins_age_19_34: StateMetric,
  num_marketplace_wPTC_age_19_34: StateMetric,
  perc_marketplace_wPTC_age_19_34: StateMetric,
  num_unins_age_35_54: StateMetric,
  perc_unins_age_35_54: StateMetric,
  num_marketplace_wPTC_age_35_54: StateMetric,
  perc_marketplace_wPTC_age_35_54: StateMetric,
  num_unins_age_55_64: StateMetric,
  perc_unins_age_55_64: StateMetric,
  num_marketplace_wPTC_age_55_64: StateMetric,
  perc_marketplace_wPTC_age_55_64: StateMetric,
  num_unins_black_nh: StateMetric,
  perc_unins_black_nh: StateMetric,
  num_marketplace_wPTC_black_nh: StateMetric,
  perc_marketplace_wPTC_black_nh: StateMetric,
  num_unins_hispanic: StateMetric,
  perc_unins_hispanic: StateMetric,
  num_marketplace_wPTC_hispanic: StateMetric,
  perc_marketplace_wPTC_hispanic: StateMetric,
  num_unins_white_nh: StateMetric,
  perc_unins_white_nh: StateMetric,
  num_marketplace_wPTC_white_nh: StateMetric,
  perc_marketplace_wPTC_white_nh: StateMetric,
  num_unins_anyother_nh: StateMetric,
  perc_unins_anyother_nh: StateMetric,
  num_marketplace_wPTC_anyother_nh: StateMetric,
  perc_marketplace_wPTC_anyother_nh: StateMetric,
}

export type RawStateData = {
  name: string,
  fips: string,
  abbr: string,
  num_change_in_uninsured: number,
  perc_change_in_uninsured: number,
  num_change_in_marketplace_wPTC: number,
  perc_change_in_marketplace_wPTC: number,
  num_change_in_aca_compliant_nongroup: number,
  perc_change_in_aca_compliant_nongroup: number,
  num_change_in_ESI: number,
  perc_change_in_ESI: number,
  num_unins_138_FPL: number,
  perc_unins_138_FPL: number,
  num_marketplace_wPTC_138_FPL: number,
  perc_marketplace_wPTC_138_FPL: number,
  num_unins_138_200_FPL: number,
  perc_unins_138_200_FPL: number,
  num_marketplace_wPTC_138_200_FPL: number,
  perc_marketplace_wPTC_138_200_FPL: number,
  num_unins_200_400_FPL: number,
  perc_unins_200_400_FPL: number,
  num_marketplace_wPTC_200_400_FPL: number,
  perc_marketplace_wPTC_200_400_FPL: number,
  num_unins_400_FPL: number,
  perc_unins_400_FPL: number,
  num_marketplace_wPTC_400_FPL: number,
  perc_marketplace_wPTC_400_FPL: number,
  num_unins_children: number,
  perc_unins_children: number,
  num_marketplace_wPTC_children: number,
  perc_marketplace_wPTC_children: number,
  num_unins_age_19_34: number,
  perc_unins_age_19_34: number,
  num_marketplace_wPTC_age_19_34: number,
  perc_marketplace_wPTC_age_19_34: number,
  num_unins_age_35_54: number,
  perc_unins_age_35_54: number,
  num_marketplace_wPTC_age_35_54: number,
  perc_marketplace_wPTC_age_35_54: number,
  num_unins_age_55_64: number,
  perc_unins_age_55_64: number,
  num_marketplace_wPTC_age_55_64: number,
  perc_marketplace_wPTC_age_55_64: number,
  num_unins_black_nh: number,
  perc_unins_black_nh: number,
  num_marketplace_wPTC_black_nh: number,
  perc_marketplace_wPTC_black_nh: number,
  num_unins_hispanic: number,
  perc_unins_hispanic: number,
  num_marketplace_wPTC_hispanic: number,
  perc_marketplace_wPTC_hispanic: number,
  num_unins_white_nh: number,
  perc_unins_white_nh: number,
  num_marketplace_wPTC_white_nh: number,
  perc_marketplace_wPTC_white_nh: number,
  num_unins_anyother_nh: number,
  perc_unins_anyother_nh: number,
  num_marketplace_wPTC_anyother_nh: number,
  perc_marketplace_wPTC_anyother_nh: number,
}
