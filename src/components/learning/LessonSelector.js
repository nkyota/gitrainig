import { useState, useEffect } from 'react';
import styles from '../../styles/LessonSelector.module.css';

export default function LessonSelector({ lessons, onSelectLesson, userProgress }) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredLessons, setFilteredLessons] = useState([]);
  
  // カテゴリーの一覧を取得
  const categories = ['all', ...new Set(lessons.map(lesson => lesson.category))];
  
  // レッスンのフィルタリング
  useEffect(() => {
    let filtered = lessons;
    
    // カテゴリーでフィルタリング
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(lesson => lesson.category === selectedCategory);
    }
    
    // 検索語でフィルタリング
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(lesson => 
        lesson.title.toLowerCase().includes(term) || 
        lesson.description.toLowerCase().includes(term) ||
        lesson.tags.some(tag => tag.toLowerCase().includes(term))
      );
    }
    
    setFilteredLessons(filtered);
  }, [lessons, selectedCategory, searchTerm]);
  
  // 進捗状況に基づいてレッスンの完了率を計算
  const getCompletionPercentage = (lessonId) => {
    if (!userProgress || !userProgress[lessonId]) return 0;
    return userProgress[lessonId].completionPercentage || 0;
  };
  
  // 獲得ポイントを取得
  const getEarnedPoints = (lessonId) => {
    if (!userProgress || !userProgress[lessonId]) return 0;
    return userProgress[lessonId].earnedPoints || 0;
  };
  
  // 難易度に応じたラベルとスタイルを取得
  const getDifficultyLabel = (difficulty) => {
    switch(difficulty) {
      case 'beginner':
        return { label: '初級', className: styles.difficultyBeginner };
      case 'intermediate':
        return { label: '中級', className: styles.difficultyIntermediate };
      case 'advanced':
        return { label: '上級', className: styles.difficultyAdvanced };
      default:
        return { label: '初級', className: styles.difficultyBeginner };
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Gitレッスン一覧</h2>
        <div className={styles.filters}>
          <div className={styles.searchContainer}>
            <input
              type="text"
              placeholder="レッスンを検索..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
            {searchTerm && (
              <button 
                className={styles.clearSearch}
                onClick={() => setSearchTerm('')}
              >
                ×
              </button>
            )}
          </div>
          
          <div className={styles.categoryFilter}>
            {categories.map(category => (
              <button
                key={category}
                className={`${styles.categoryButton} ${selectedCategory === category ? styles.active : ''}`}
                onClick={() => setSelectedCategory(category)}
              >
                {category === 'all' ? 'すべて' : category}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      <div className={styles.lessonGrid}>
        {filteredLessons.length > 0 ? (
          filteredLessons.map(lesson => {
            const completionPercentage = getCompletionPercentage(lesson.id);
            const earnedPoints = getEarnedPoints(lesson.id);
            const difficulty = getDifficultyLabel(lesson.difficulty);
            
            return (
              <div 
                key={lesson.id} 
                className={styles.lessonCard}
                onClick={() => onSelectLesson(lesson)}
              >
                {lesson.image && (
                  <div className={styles.lessonImage}>
                    <img src={lesson.image} alt={lesson.title} />
                    {completionPercentage === 100 && (
                      <div className={styles.completedBadge}>完了</div>
                    )}
                  </div>
                )}
                
                <div className={styles.lessonContent}>
                  <h3 className={styles.lessonTitle}>{lesson.title}</h3>
                  
                  <div className={styles.lessonMeta}>
                    <span className={difficulty.className}>{difficulty.label}</span>
                    <span className={styles.lessonDuration}>{lesson.duration}</span>
                  </div>
                  
                  <p className={styles.lessonDescription}>{lesson.description}</p>
                  
                  <div className={styles.lessonTags}>
                    {lesson.tags.map(tag => (
                      <span key={tag} className={styles.tag}>{tag}</span>
                    ))}
                  </div>
                  
                  <div className={styles.lessonFooter}>
                    <div className={styles.progressContainer}>
                      <div className={styles.progressBar}>
                        <div 
                          className={styles.progressFill}
                          style={{ width: `${completionPercentage}%` }}
                        ></div>
                      </div>
                      <span className={styles.progressText}>{completionPercentage}%</span>
                    </div>
                    
                    {earnedPoints > 0 && (
                      <div className={styles.pointsBadge}>
                        <span className={styles.pointsIcon}>★</span>
                        <span className={styles.pointsValue}>{earnedPoints}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className={styles.emptyState}>
            <p>条件に一致するレッスンが見つかりませんでした。</p>
            <button 
              className={styles.resetButton}
              onClick={() => {
                setSelectedCategory('all');
                setSearchTerm('');
              }}
            >
              フィルターをリセット
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
