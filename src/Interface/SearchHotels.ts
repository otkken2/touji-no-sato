export interface SearchHotels {
  primary_count?:            number;
  count?:                    number;
  room_distribution?:        RoomDistribution[];
  map_bounding_box?:         MapBoundingBox;
  total_count_with_filters?: number;
  unfiltered_count?:         number;
  extended_count?:           number;
  unfiltered_primary_count?: number;
  search_radius?:            number;
  sort?:                     Sort[];
  result?:                   Result[];
}

export interface MapBoundingBox {
  sw_long?: number;
  ne_long?: number;
  ne_lat?:  number;
  sw_lat?:  number;
}

export interface Result {
  city?:                         City;
  native_ad_id?:                 string;
  review_score?:                 number;
  cc_required?:                  number;
  composite_price_breakdown?:    PriceBreakdown;
  ribbon_text?:                  RibbonText;
  has_free_parking?:             number;
  longitude?:                    number;
  cc1?:                          Cc1;
  extended?:                     number;
  currencycode?:                 Currency;
  id?:                           string;
  distance_to_cc_formatted?:     string;
  district_id?:                  number;
  countrycode?:                  Cc1;
  default_language?:             DefaultLanguage;
  default_wishlist_name?:        CityInTrans;
  review_score_word?:            string;
  timezone?:                     Timezone;
  preferred_plus?:               number;
  is_geo_rate?:                  string;
  badges?:                       any[];
  main_photo_url?:               string;
  hotel_has_vb_boost?:           number;
  city_in_trans?:                CityInTrans;
  booking_home?:                 BookingHome;
  distance?:                     string;
  is_no_prepayment_block?:       number;
  is_mobile_deal?:               number;
  updated_checkin?:              null;
  is_highlighted_hotel?:         number;
  checkin?:                      Check;
  country_trans?:                CountryTrans;
  price_is_final?:               number;
  main_photo_id?:                number;
  hotel_name?:                   string;
  city_trans?:                   CityInTrans;
  native_ads_tracking?:          string;
  city_name_en?:                 City;
  district?:                     District;
  mobile_discount_percentage?:   number;
  unit_configuration_label?:     string;
  url?:                          string;
  updated_checkout?:             null;
  is_beach_front?:               number;
  accommodation_type?:           number;
  is_wholesaler_candidate?:      number;
  selected_review_topic?:        null;
  wishlist_count?:               number;
  address_trans?:                string;
  urgency_message?:              string;
  review_nr?:                    number;
  b_max_los_data?:               BMaxLosData;
  cant_book?:                    null;
  soldout?:                      number;
  hotel_name_trans?:             string;
  native_ads_cpc?:               number;
  accommodation_type_name?:      AccommodationTypeName;
  class_is_estimated?:           number;
  checkout?:                     Check;
  distance_to_cc?:               string;
  ufi?:                          number;
  in_best_district?:             number;
  is_free_cancellable?:          number;
  genius_discount_percentage?:   number;
  block_ids?:                    string[];
  hotel_id?:                     number;
  latitude?:                     number;
  min_total_price?:              number;
  is_genius_deal?:               number;
  is_smart_deal?:                number;
  address?:                      string;
  distances?:                    Distance[];
  matching_units_configuration?: MatchingUnitsConfiguration;
  preferred?:                    number;
  zip?:                          string;
  type?:                         Type;
  children_not_allowed?:         null;
  is_city_center?:               number;
  review_recommendation?:        string;
  bwallet?:                      Bwallet;
  price_breakdown?:              PriceBreakdownClass;
  districts?:                    string;
  currency_code?:                Currency;
  hotel_facilities?:             string;
  class?:                        number;
  max_photo_url?:                string;
  max_1440_photo_url?:           string;
  hotel_include_breakfast?:      number;
  has_swimming_pool?:            number;
}

export type AccommodationTypeName = "旅館" | "リゾート" | "ホテル";

export interface BMaxLosData {
  has_extended_los?: number;
  extended_los?:     number;
  is_fullon?:        number;
  experiment?:       Experiment;
  max_allowed_los?:  number;
  default_los?:      number;
}

export type Experiment = "long_stays_android_extend_los_3";

export interface BookingHome {
  is_booking_home?:         number;
  group?:                   Group;
  segment?:                 number;
  is_single_unit_property?: number | string;
  quality_class?:           number;
}

export type Group = "hotels_and_others";

export interface Bwallet {
  hotel_eligibility?: number;
}

export type Cc1 = "jp";

export interface Check {
  until?: string;
  from?:  string;
}

export type City = "Minakami" | "Minakami-Machi, Tone-Gun, Gunma" | "Minakami ";

export type CityInTrans = "みなかみ町";

export interface PriceBreakdown {
  product_price_breakdowns?:          PriceBreakdown[];
  excluded_amount?:                   AllInclusiveAmount;
  items?:                             Item[];
  benefits?:                          any[];
  gross_amount?:                      AllInclusiveAmount;
  gross_amount_per_night?:            AllInclusiveAmount;
  all_inclusive_amount?:              AllInclusiveAmount;
  included_taxes_and_charges_amount?: AllInclusiveAmount;
  net_amount?:                        AllInclusiveAmount;
  gross_amount_hotel_currency?:       AllInclusiveAmount;
}

export interface AllInclusiveAmount {
  value?:    number;
  currency?: Currency;
}

export type Currency = "JPY";

export interface Item {
  inclusion_type?: InclusionType;
  kind?:           ItemKind;
  name?:           Name;
  base?:           Base;
  item_amount?:    AllInclusiveAmount;
  details?:        Details;
}

export interface Base {
  percentage?:  number;
  kind?:        BaseKind;
  base_amount?: number;
}

export type BaseKind = "percentage" | "per_person_per_night" | "per_night" | "not_applicable";

export type Details = "10 % 消費税/VAT" | "入湯税" | "10 % サービス料" | "環境税" | "市税" | "スパ利用税";

export type InclusionType = "included" | "excluded";

export type ItemKind = "charge";

export type Name = "消費税/VAT" | "入湯税" | "サービス料" | "環境税" | "市税" | "スパ利用税";

export type CountryTrans = "日本";

export type DefaultLanguage = "en" | "ja";

export interface Distance {
  text?:      string;
  icon_set?:  null;
  icon_name?: IconName;
}

export type IconName = "bui_geo_pin";

export type District = "" | "水上温泉郷";

export interface MatchingUnitsConfiguration {
  matching_units_common_config?: MatchingUnitsCommonConfig;
}

export interface MatchingUnitsCommonConfig {
  unit_type_id?:   number;
  localized_area?: null;
}

export interface PriceBreakdownClass {
  gross_price?:              string;
  has_tax_exceptions?:       number;
  has_incalculable_charges?: number;
  has_fine_print_charges?:   number;
  all_inclusive_price?:      number;
  currency?:                 Currency;
  sum_excluded_raw?:         string;
}

export type RibbonText = "朝食+夕食込み" | "朝食付き";

export type Timezone = "Asia/Tokyo";

export type Type = "property_card";

export interface RoomDistribution {
  adults?:   string;
  children?: any[];
}

export interface Sort {
  name?: string;
  id?:   string;
}
