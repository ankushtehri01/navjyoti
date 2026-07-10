import { useQuery } from '@tanstack/react-query';
import {
  ResponsiveContainer, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip,
} from 'recharts';
import { FiUsers, FiLayers, FiCheckCircle, FiDollarSign } from 'react-icons/fi';
import PageHeader from '@/components/common/PageHeader.jsx';
import { Card } from '@/components/ui';
import { analyticsService } from '@/services/admin.js';
import { formatCompactCurrency, formatNumber } from '@/utils/format.js';

// Sample fallback so the dashboard is meaningful before the analytics API exists.
const SAMPLE = {
  kpis: { users: 5280, applications: 1840, approved: 1120, disbursed: 4200000000 },
  monthly: [
    { month: 'Jan', applications: 120, approved: 74 },
    { month: 'Feb', applications: 145, approved: 88 },
    { month: 'Mar', applications: 168, approved: 101 },
    { month: 'Apr', applications: 190, approved: 121 },
    { month: 'May', applications: 176, approved: 118 },
    { month: 'Jun', applications: 210, approved: 140 },
  ],
  byCategory: [
    { name: 'Personal', value: 420 },
    { name: 'Business', value: 310 },
    { name: 'Home', value: 380 },
    { name: 'Car', value: 240 },
    { name: 'Education', value: 190 },
    { name: 'Gold', value: 300 },
  ],
  byStatus: [
    { name: 'Approved', value: 1120 },
    { name: 'Under Review', value: 360 },
    { name: 'Rejected', value: 210 },
    { name: 'Disbursed', value: 150 },
  ],
};

const STATUS_COLORS = ['#22c55e', '#f59e0b', '#ef4444', '#3b82f6'];

const ChartTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-strong rounded-lg px-3 py-2 text-xs">
      {label && <p className="mb-1 font-semibold text-white">{label}</p>}
      {payload.map((p) => (
        <p key={p.name} style={{ color: p.color || p.fill }}>
          {p.name}: <span className="font-medium">{formatNumber(p.value)}</span>
        </p>
      ))}
    </div>
  );
};

const Kpi = ({ icon: Icon, label, value }) => (
  <Card className="flex items-center gap-4">
    <span className="gradient-brand flex h-12 w-12 items-center justify-center rounded-xl text-white">
      <Icon size={20} />
    </span>
    <div>
      <p className="text-2xl font-bold text-white">{value}</p>
      <p className="text-sm text-slate-400">{label}</p>
    </div>
  </Card>
);

const AdminOverviewPage = () => {
  const { data } = useQuery({
    queryKey: ['admin', 'analytics'],
    queryFn: () => analyticsService.overview(),
    retry: false,
  });

  const a = data ?? SAMPLE;
  const axisProps = { stroke: '#64748b', fontSize: 12, tickLine: false, axisLine: false };

  return (
    <>
      <PageHeader title="Analytics" subtitle="Overview of platform performance and activity." />

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <Kpi icon={FiUsers} label="Total Users" value={formatNumber(a.kpis.users)} />
        <Kpi icon={FiLayers} label="Applications" value={formatNumber(a.kpis.applications)} />
        <Kpi icon={FiCheckCircle} label="Approved" value={formatNumber(a.kpis.approved)} />
        <Kpi icon={FiDollarSign} label="Disbursed" value={formatCompactCurrency(a.kpis.disbursed)} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        {/* Applications trend */}
        <Card className="lg:col-span-2">
          <h3 className="mb-6 font-semibold text-white">Applications trend</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={a.monthly} margin={{ left: -20 }}>
                <defs>
                  <linearGradient id="gApp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gApr" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#06b6d4" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="#06b6d4" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
                <XAxis dataKey="month" {...axisProps} />
                <YAxis {...axisProps} />
                <Tooltip content={<ChartTooltip />} />
                <Area type="monotone" dataKey="applications" stroke="#3b82f6" fill="url(#gApp)" strokeWidth={2} />
                <Area type="monotone" dataKey="approved" stroke="#06b6d4" fill="url(#gApr)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Status distribution */}
        <Card>
          <h3 className="mb-6 font-semibold text-white">By status</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={a.byStatus} dataKey="value" nameKey="name" innerRadius={55} outerRadius={90} paddingAngle={3} stroke="none">
                  {a.byStatus.map((entry, i) => (
                    <Cell key={entry.name} fill={STATUS_COLORS[i % STATUS_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<ChartTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 grid grid-cols-2 gap-2">
            {a.byStatus.map((s, i) => (
              <div key={s.name} className="flex items-center gap-2 text-xs text-slate-400">
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: STATUS_COLORS[i % STATUS_COLORS.length] }} />
                {s.name}
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* By category */}
      <Card className="mt-6">
        <h3 className="mb-6 font-semibold text-white">Applications by loan category</h3>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={a.byCategory} margin={{ left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
              <XAxis dataKey="name" {...axisProps} />
              <YAxis {...axisProps} />
              <Tooltip content={<ChartTooltip />} cursor={{ fill: 'rgba(255,255,255,0.04)' }} />
              <Bar dataKey="value" fill="#3b82f6" radius={[6, 6, 0, 0]} maxBarSize={48} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </>
  );
};

export default AdminOverviewPage;
