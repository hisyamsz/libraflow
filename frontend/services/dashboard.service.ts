import instance from "@/lib/axios";
import endpoint from "./endpoint.constant";
import { ApiResponse } from "@/types/Api";
import { AdminStats, MemberStats } from "@/types/Dashboard";

const dashboardService = {
  getAdminStats: () =>
    instance.get<ApiResponse<AdminStats>>(`${endpoint.DASHBOARD}/stats`),
    
  getMemberStats: () =>
    instance.get<ApiResponse<MemberStats>>(`${endpoint.DASHBOARD}/my-stats`),
};

export default dashboardService;
