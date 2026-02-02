import { trendingProjects } from '../../data/projects';

const TrendingProjects = ({ onSelect }) => {
  return (
    <section id="projects" className="py-16 px-4 bg-gradient-to-b from-gray-800/50 to-transparent">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-block bg-purple-500/20 text-purple-400 px-3 py-1 rounded-full text-xs font-medium mb-4">🔥 NEW</div>
          <h2 className="text-3xl font-bold mb-3">Latest Trending Projects</h2>
          <p className="text-gray-400">No project idea? No problem! Choose from our trending project topics</p>
          <p className="text-gray-500 text-sm mt-2">From ideation → development → documentation → deployment → presentation</p>
        </div>

        <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4">
          {trendingProjects.map((project, idx) => (
            <div key={idx} onClick={onSelect} className="bg-gray-800/80 p-4 rounded-xl border border-gray-700 hover:border-orange-500/50 transition cursor-pointer group">
              <div className="flex items-start justify-between mb-2">
                <span className="text-xs bg-gray-700 px-2 py-1 rounded text-gray-400">{project.category}</span>
                {project.hot && <span className="text-xs bg-orange-500/20 text-orange-400 px-2 py-1 rounded">🔥 Hot</span>}
              </div>
              <h3 className="font-bold text-sm mb-1 group-hover:text-orange-400 transition">{project.title}</h3>
              <p className="text-gray-500 text-xs">{project.tech}</p>
            </div>
          ))}
        </div>

        <div className="text-center mt-8">
          <button onClick={onSelect} className="bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-xl font-bold transition">Request Custom Project Idea →</button>
        </div>
      </div>
    </section>
  );
};

export default TrendingProjects;
