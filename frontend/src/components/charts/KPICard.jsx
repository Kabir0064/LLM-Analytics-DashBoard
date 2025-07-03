import { motion } from 'framer-motion';
import { FiTrendingUp, FiTrendingDown, FiDollarSign, FiUsers, FiTarget, FiActivity } from 'react-icons/fi';

function KPICard({ title, value, change, trend, icon, delay = 0 }) {
  const isPositive = trend === 'up';
  
  const icons = {
    revenue: <FiDollarSign className="w-6 h-6" />,
    users: <FiUsers className="w-6 h-6" />,
    target: <FiTarget className="w-6 h-6" />,
    activity: <FiActivity className="w-6 h-6" />
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ scale: 1.05 }}
      className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-gray-600 text-sm font-medium">{title}</p>
          <motion.p 
            className="text-2xl font-bold text-gray-800 mt-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: delay + 0.2 }}
          >
            {value}
          </motion.p>
          {change && (
            <div className={`flex items-center mt-2 text-sm ${
              isPositive ? 'text-green-600' : 'text-red-600'
            }`}>
              {isPositive ? <FiTrendingUp className="w-4 h-4 mr-1" /> : <FiTrendingDown className="w-4 h-4 mr-1" />}
              <span>{change}</span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-lg ${
          isPositive ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'
        }`}>
          {icons[icon] || icons.activity}
        </div>
      </div>
    </motion.div>
  );
}

export default KPICard;