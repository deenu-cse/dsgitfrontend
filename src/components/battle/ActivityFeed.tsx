import { motion } from 'framer-motion';

export default function ActivityFeed({ activities }: any) {
  return (
    <div className="bg-[#111] p-4 rounded">
      <h2 className="text-xl text-[#1D9E75] font-bold mb-4">Live Feed</h2>
      <div className="space-y-3">
        {activities && activities.length > 0 ? (
          activities.map((a: any, i: number) => (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              key={i}
              className="text-sm text-zinc-300 border-l-2 border-[#1D9E75] pl-2"
            >
              <strong className="text-[#1D9E75]">{a.username}</strong>
              {' '}solved{' '}
              <strong>{a.questionName}</strong>
              {' '}
              <span className="text-xs px-2 py-0.5 bg-zinc-800 rounded ml-1 inline-block">
                {a.difficulty}
              </span>
              {a.points && (
                <span className="text-xs text-[#1D9E75] ml-1">
                  +{a.points} pts
                </span>
              )}
            </motion.div>
          ))
        ) : (
          <div className="text-xs text-zinc-500 italic">No activity yet...</div>
        )}
      </div>
    </div>
  );
}