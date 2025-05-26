import React, { useState } from 'react';
import { Book, Video, Code, Brain, Target, ExternalLink, Search } from 'lucide-react';

const Resources = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All Resources', icon: <Book className="w-5 h-5" /> },
    { id: 'dsa', name: 'Data Structures & Algorithms', icon: <Code className="w-5 h-5" /> },
    { id: 'math', name: 'Mathematics', icon: <Brain className="w-5 h-5" /> },
    { id: 'trading', name: 'Trading & Finance', icon: <Target className="w-5 h-5" /> },
    { id: 'videos', name: 'Video Courses', icon: <Video className="w-5 h-5" /> }
  ];

  const resources = [
    {
      id: 1,
      title: 'Competitive Programming Course',
      description: 'Complete course covering DSA, algorithms, and problem-solving techniques',
      category: 'dsa',
      type: 'course',
      difficulty: 'Intermediate',
      link: 'https://www.coursera.org/specializations/data-structures-algorithms',
      tags: ['algorithms', 'problem-solving', 'practice']
    },
    {
      id: 2,
      title: 'Quantitative Finance Fundamentals',
      description: 'Learn the basics of quantitative finance, market making, and trading strategies',
      category: 'trading',
      type: 'book',
      difficulty: 'Beginner',
      link: 'https://www.amazon.com/Quantitative-Finance-For-Dummies/dp/1118769465',
      tags: ['finance', 'trading', 'basics']
    },
    {
      id: 3,
      title: 'Probability and Statistics for Trading',
      description: 'Essential mathematical concepts for quantitative trading',
      category: 'math',
      type: 'course',
      difficulty: 'Advanced',
      link: 'https://www.edx.org/course/probability-and-statistics-in-data-science',
      tags: ['statistics', 'probability', 'mathematics']
    },
    {
      id: 4,
      title: 'Market Making Strategies',
      description: 'Video series on market making, order book dynamics, and HFT strategies',
      category: 'videos',
      type: 'video',
      difficulty: 'Advanced',
      link: 'https://www.youtube.com/playlist?list=PLDcSwjT2BF_VuNbn8HiHZJkRcLcJxRkQJ',
      tags: ['market-making', 'hft', 'strategies']
    },
    {
      id: 5,
      title: 'Low-Latency Programming',
      description: 'Learn about performance optimization, C++, and low-latency systems',
      category: 'dsa',
      type: 'course',
      difficulty: 'Advanced',
      link: 'https://www.udemy.com/course/low-latency-programming/',
      tags: ['performance', 'c++', 'optimization']
    },
    {
      id: 6,
      title: 'Financial Mathematics',
      description: 'Mathematical foundations for quantitative finance',
      category: 'math',
      type: 'book',
      difficulty: 'Intermediate',
      link: 'https://www.amazon.com/Financial-Mathematics-Comprehensive-Introduction/dp/1498728665',
      tags: ['mathematics', 'finance', 'theory']
    }
  ];

  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         resource.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = activeCategory === 'all' || resource.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <Book className="w-6 h-6" />
        Study Resources
      </h2>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search resources..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap ${
                activeCategory === category.id
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category.icon}
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Resources Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {filteredResources.map(resource => (
          <div key={resource.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-lg">{resource.title}</h3>
                <p className="text-gray-600 mt-1">{resource.description}</p>
              </div>
              <span className={`px-2 py-1 text-xs rounded ${
                resource.difficulty === 'Beginner' ? 'bg-green-100 text-green-800' :
                resource.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {resource.difficulty}
              </span>
            </div>
            
            <div className="mt-4 flex flex-wrap gap-2">
              {resource.tags.map((tag, idx) => (
                <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                  {tag}
                </span>
              ))}
            </div>

            <a
              href={resource.link}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-2 text-blue-500 hover:text-blue-600"
            >
              <ExternalLink className="w-4 h-4" />
              Open Resource
            </a>
          </div>
        ))}
      </div>

      {/* Add Resource Button */}
      <button
        onClick={() => {/* Add resource logic */}}
        className="mt-6 w-full py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
      >
        Suggest a Resource
      </button>
    </div>
  );
};

export default Resources; 