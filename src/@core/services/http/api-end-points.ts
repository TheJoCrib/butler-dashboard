export const API_ENDPOINTS = {
  ROLE : 'role',
  ADMIN:'admin',
  PERMISSION:'permission',
  USER:'user',
  CATEGORY:'category',
  JOB:'job',
  REVIEW:'review',
  INVOICE:'invoice',
  CHAT:'chat',
  SKILL_UPDATE:'skillUpdateRequest',
  PAYMENT:'payment',


  DASHBOARD: {
    freelancers_Onboarding_Insight: 'api/v1/dashboard/freelancers-onboarding-insight',
    monthly_order_data: 'api/v1/dashboard/monthly-order',
    top_customers: 'api/v1/dashboard/top-customeers',
    online_freelancer_stats: 'api/v1/dashboard/online-freelancers-stats',
    popular_vehicles: 'api/v1/dashboard/popular-vehicles',
    recent_order: 'api/v1/dashboard/recent-order',
    order_trends: 'api/v1/dashboard/order-trends',
    customers_and_order_statistics: 'api/v1/dashboard/customers-order-statistics',
  },

  FREELANCERS: {
    FREELANCER_LISTING: 'api/v1/freelancers/freelancer-listing',
    UPDATE_FREELANCER_STATUS: 'api/v1/freelancers/update-freelancer-status'
  },

  ORDER: {
      CREATE_ORDER: 'job',
      ORDER_LISTING: 'api/v1/order/order-listing',
  },

  CITIES: {
    cities_listing: 'api/v1/cities/cities-listing',
    update_cities_status: 'api/v1/cities/update-cities-status'
  },

  Announcement: {
    announcement_listing: 'api/v1/announcement/announcements-listing',
    add_new_announcement: 'api/v1/announcement/add-new-announcement',
    update_announcement_details: 'api/v1/announcement/update-announcement',
    update_announcement_status: 'api/v1/announcement/update-announcement-status'
  }


};


