export interface SearchLocations {
  label?:          string;
  rtl?:            number;
  dest_type?:      string;
  latitude?:       number;
  image_url?:      string;
  city_name?:      string;
  cc1?:            string;
  b_max_los_data?: BMaxLosData;
  longitude?:      number;
  name?:           string;
  region?:         string;
  dest_id?:        string;
  country?:        string;
  city_ufi?:       number;
  type?:           string;
  lc?:             string;
  timezone?:       string;
  nr_hotels?:      number;
  hotels?:         number;
}

export interface BMaxLosData {
  extended_los?:     number;
  default_los?:      number;
  has_extended_los?: number;
  is_fullon?:        number;
  experiment?:       string;
  max_allowed_los?:  number;
}
