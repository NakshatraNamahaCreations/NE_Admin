const apiUrl = {
  IMAGEURL: "https://api.nithyaevent.com/",
  BASEURL: "https://api.nithyaevent.com/api",

  // IMAGEURL: "http://localhost:9000/",
  // BASEURL: "http://localhost:9000/api",

  // public ip - old
  // IMAGEURL: "http://3.95.141.179:9000/",
  // BASEURL: "http://3.95.141.179:9000/api",

  // PROFILE
  ADD_PROFILE: "/company-profile/add-profile",
  GET_PROFILE: "/company-profile/get-profile",
  ADD_SOCIAL_MEDIA: "/company-profile/add-social-mediaLink/",
  // DELETE_LINK: "/company-profile/link",

  //PRODUCT
  ADD_PRODUCT: "/product/addproduct",
  ADD_PRODUCTS_VIA_EXCEL: "/product/add-products-via-excel",
  ADD_PRODUCT_IMAGES: "/product/add-product-image/",

  ALL_PRODUCT: "/product/getallproduct",
  GET_RENTAL_PRODUCTS: "/product/get-rental-product-for-admin",
  GET_SELLING_PRODUCTS: "/product/get-all-sell-product-for-admin",
  GET_PRODUCT_BY_VENDOR: "/product/getvendorproduct/",
  PRODUCT_APPROVE: "/product/product-approved/",
  PRODUCT_DISAPPROVE: "/product/product-disapproved/",
  DELETE_PRODUCT: "/product/delete-product/",
  PRODUCT_STATUS_CHANGE: "/product/product-Status/",
  // VENDOR SERVICE
  GET_VENDOR_SERVICE: "/vendor-service/get-all-services",
  SERVICE_APPROVE: "/vendor-service/approve-service/",
  SERVICE_DISAPPROVE: "/vendor-service/disapprove-service/",
  GET_SERVICE_BY_VENDOR_ID: "/vendor-service/get-services-by-vendor-id/",
  DELETE_VENDOR_SERVICE: "/vendor-service/delete-service/",
  // VENDOR
  GET_PRODUCT_VENDOR: "/vendor/get-product-vendor",
  GET_ALL_VENDOR: "/vendor/get-all-vendors-for-admin",
  GET_APPROVED_VENDOR: "/vendor/get-all-vendors-for-admin",
  VENDOR_APPROVE: "/vendor/vendor-approve/",
  GET_VENDOR_PROFILE: "/vendor/getprofile/",
  VENDOR_DISAPPROVE: "/vendor/vendor-disapprove/",
  ADD_COMMISSION: "/vendor/add-commissions/",
  EDIT_BANK_DETAILS: "/vendor/edit-bank-details/",
  UPDATE_VENDOR_STATUS: "/vendor/vendor-Status/",
  DELETE_VENDOR: "/vendor/delete-vendor/",

  // USER
  GET_PARTICULAR_USER: "/user/get-user-profile/",
  GET_USERS_LIST: "/user/get-all-user",
  DELETE_USER: "/user/delete-profile/",

  // TEAM
  CREATE_TEAM: "/team/create-team",
  TEAM_USER_LOGIN: "/team/team-user-login",
  GET_ALL_TEAM: "/team/get-all-member",
  BLOCK_USER: "/team/block-user",
  UNBLOCK_USER: "/team/unblock-user",
  GET_TEAM: "/team/get-user",
  DELETE_TECHNICIAN: "/technician/delete_technician/",
  UPDATE_USER: "/team/update-user/",
  UPDATE_PASSWORD: "/team/update-password/",
  DELETE_TEAM_USER: "/team/delete-team-user/",
  LOGOUT_TEAMPLAYER: "/team/logout-user/",

  ADD_TECHNICIAN: "/technician/add-technician",
  GET_ALL_TECHNICIAN: "/technician/get-all-technician",
  // DELETE_TECHNICIAN: "/technician/delete_technician/",

  // ORDER
  GET_ALL_ORDER: "/user-order/getallorder",
  CANCEL_EVENTS: "/user-order/get-cancelled-events",
  RESCHEDULED_EVENTS: "/user-order/get-rescheduled-events",

  // SERVICE
  ADD_SERVICE: "/service/add-service",
  ADD_SERVICE_VIA_EXCEL: "/service/add-service-via-excel",
  GET_ALL_SERVICE: "/service/get-all-service",
  GET_ACTIVE_SERVICE: "/service/get-active-service",
  DELETE_SERVICE: "/service/delete-service",
  ADD_REQUIREMENTS: "/service/add-requirements",
  UPDATE_SERVICE_STATUS: "/service/update-status/",

  // SUB-SERVICE
  ADD_SUB_SERVICE: "/sub-service/add-sub-service",
  GET_ALL_SUB_SERVICE: "/sub-service/get-all-sub-service",
  GET_ACTIVE_SUB_SERVICE: "/sub-service/get-active-sub-service",
  UPDATE_SUB_SERVICE_STATUS: "/sub-service/update-sub-service-status/",
  DELETE_SUB_SERVICE: "/sub-service/delete-sub-service",

  //STATE
  ADD_STATE: "/state/add-state",
  GET_STATE: "/state/get-all-states",
  GET_ACTIVE_STATE: "/state/get-active-states",
  GET_STATE_BY_ID: "/state/get-states-by-id/",
  DELETE_STATE: "/state/delete-state/",
  // EDIT_STATE: "/state/edit-state/",
  ACTIVE_STATUS: "/state/active-status/",
  INACTIVE_STATUS: "/state/inactive-status/",

  //CITY
  ADD_CITY: "/city/add-city",
  GET_CITY: "/city/get-all-cities",
  GET_ACTIVE_CITIES: "/city/get-active-cities",
  GET_CITY_BY_ID: "/city/get-city-by-id/",
  DELETE_CITY: "/city/delete-city/",
  // EDIT_CITY: "/city/edit-city/",
  CITY_ACTIVE_STATUS: "/city/city-active-status/",
  CITY_INACTIVE_STATUS: "/city/city-inactive-status/",

  //ADDRESS
  ADD_ADDRESS: "/address/add-address",
  GET_ADDRESS: "/address/get-all-addresses",
  GET_ACTIVE_ADDRESSESS: "/address/get-active-addresses",
  GET_ADDRESS_BY_ID: "/address/get-address-by-id/",
  DELETE_ADDRESS: "/address/delete-address/",
  // EDIT_CITY: "/address/edit-address/",
  ADDRESS_ACTIVE_STATUS: "/address/address-active-status/",
  ADDRESS_INACTIVE_STATUS: "/address/address-inactive-status/",

  // BANNER
  ADD_BANNERS: "/banners/createbanner",
  GET_ALL_BANNERS: "/banners/get-all-banners",
  DELETE_BANNER: "/banners/deletebanner/",

  // FAQ
  ADD_FAQ: "/faq/add-faq",
  GET_ALL_FAQ: "/faq/get-all-faq",
  GET_USER_FAQ: "/faq/get-user-faq",
  GET_VENDOR_FAQ: "/faq/get-vendor-faq",
  UPDATE_FAQ: "/faq/update-faq/",
  DELETE_FAQ: "/faq/delete-faq/",
  FAQ_STATUS: "/faq/update-faq-status/",

  // T&C
  SAVE_TNC: "/tnc/save-tnc",
  // GET_ALL_TNC: "/tnc/get-all-tnc",
  GET_USER_TNC: "/tnc/get-user-tnc",
  GET_VENDOR_TNC: "/tnc/get-vendor-tnc",
  UPDATE_TNC: "/tnc/update-tnc-byid/",
  DELETE_TNC: "/tnc/delete-tnc/",

  // SAVE_USER_TNC: "/user-tnc/add-tnc-user",
  // GET_USER_TNC: "/user-tnc/get-all-tnc-user",
  // DELETE_TNC: "/tnc/delete-tnc/",

  // COMMAN T&C FOR ALL USER

  //YOUTUBE LINK
  ADD_YOUTUBE_LINK: "/youtube/add-youtube-link",
  GET_YOUTUBE_LINK: "/youtube/get-all-youtube-links",
  GET_ACTIVE_YOUTUBE_LINKS: "/youtube/get-active-youtube-links",
  GET_YOUTUBE_LINK_BY_ID: "/youtube/get-youtube-link-by-id/",
  DELETE_YOUTUBE_LINK: "/youtube/delete-youtube-link/",
  // EDIT_CITY: "/youtube/edit-youtube-link/",
  YOUTUBE_LINK_ACTIVE_STATUS: "/youtube/youtube-link-active-status/",
  YOUTUBE_LINK_INACTIVE_STATUS: "/youtube/youtube-link-inactive-status/",

  // TICKET
  GET_All_TICKET: "/ticket/get-all-tickets",
  CHANGE_TICKET_STATUS: "/ticket/change-status/",

  // PAYOUTS
  GET_ALL_INVOICE: "/invoice/get-all-invoice",
  ADD_PAYOUTS: "/payouts/add-payout",
  CONFIRM_PAYOUT: "/payouts/confirm-payout-processed/",
  GET_PAYOUTS_BY_ID: "/payouts/get-payouts-by-id/",
  GET_ALL_PAYOUTS: "/payouts/get-all-payouts",

  // TECH PAYOUT
  ADD_TECH_PAYOUTS: "/technician-payouts/add-tech-payout",
  CONFIRM_TECH_PAYOUT: "/technician-payouts/confirm-tech-payout-processed/",
  GET_TECH_PAYOUTS_BY_ID: "/technician-payouts/get-tech-payouts-by-id/",
  GET_ALL_TECH_PAYOUTS: "/technician-payouts/get-all-tech-payouts",

  // PAYOUT CONFIG
  ADD_PAYOUT_CONFIG: "/payout-config/add-or-update-config",
  GET_PAYOUT_CONFIG: "/payout-config/get-payout-config-profile",
};
export { apiUrl };
