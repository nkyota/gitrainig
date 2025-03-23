import { useState, useEffect } from 'react';
import styles from '../../styles/AchievementSystem.module.css';

export default function AchievementSystem({ userProgress, achievements }) {
  const [showAchievementPopup, setShowAchievementPopup] = useState(false);
  const [newAchievement, setNewAchievement] = useState(null);
  const [earnedAchievements, setEarnedAchievements] = useState([]);
  const [showAllAchievements, setShowAllAchievements] = useState(false);
  
  // ユーザーの進捗に基づいて獲得した実績を計算
  useEffect(() => {
    if (!userProgress || !achievements) return;
    
    const earned = achievements.filter(achievement => {
      // 実績の条件をチェック
      switch(achievement.type) {
        case 'lesson_complete':
          return userProgress[achievement.lessonId]?.completionPercentage === 100;
          
        case 'points_total':
          const totalPoints = Object.values(userProgress).reduce(
            (sum, lesson) => sum + (lesson.earnedPoints || 0), 0
          );
          return totalPoints >= achievement.requiredPoints;
          
        case 'lessons_complete_count':
          const completedLessons = Object.values(userProgress).filter(
            lesson => lesson.completionPercentage === 100
          ).length;
          return completedLessons >= achievement.requiredCount;
          
        case 'command_usage':
          const commandUsage = Object.values(userProgress).reduce(
            (sum, lesson) => sum + (lesson.commandUsage?.[achievement.command] || 0), 0
          );
          return commandUsage >= achievement.requiredCount;
          
        default:
          return false;
      }
    });
    
    // 新しく獲得した実績があるか確認
    const newlyEarned = earned.filter(
      achievement => !earnedAchievements.some(a => a.id === achievement.id)
    );
    
    if (newlyEarned.length > 0) {
      // 最新の実績をポップアップ表示
      setNewAchievement(newlyEarned[0]);
      setShowAchievementPopup(true);
      
      // 一定時間後にポップアップを閉じる
      setTimeout(() => {
        setShowAchievementPopup(false);
      }, 5000);
    }
    
    setEarnedAchievements(earned);
  }, [userProgress, achievements]);
  
  // 実績の進捗率を計算
  const calculateProgress = (achievement) => {
    if (!userProgress) return 0;
    
    switch(achievement.type) {
      case 'lesson_complete':
        return userProgress[achievement.lessonId]?.completionPercentage || 0;
        
      case 'points_total':
        const totalPoints = Object.values(userProgress).reduce(
          (sum, lesson) => sum + (lesson.earnedPoints || 0), 0
        );
        return Math.min(100, (totalPoints / achievement.requiredPoints) * 100);
        
      case 'lessons_complete_count':
        const completedLessons = Object.values(userProgress).filter(
          lesson => lesson.completionPercentage === 100
        ).length;
        return Math.min(100, (completedLessons / achievement.requiredCount) * 100);
        
      case 'command_usage':
        const commandUsage = Object.values(userProgress).reduce(
          (sum, lesson) => sum + (lesson.commandUsage?.[achievement.command] || 0), 0
        );
        return Math.min(100, (commandUsage / achievement.requiredCount) * 100);
        
      default:
        return 0;
    }
  };
  
  // 実績の難易度に応じたスタイルを取得
  const getDifficultyStyle = (difficulty) => {
    switch(difficulty) {
      case 'bronze':
        return styles.bronze;
      case 'silver':
        return styles.silver;
      case 'gold':
        return styles.gold;
      case 'platinum':
        return styles.platinum;
      default:
        return styles.bronze;
    }
  };

  return (
    <div className={styles.container}>
      {/* 実績獲得ポップアップ */}
      {showAchievementPopup && newAchievement && (
        <div className={styles.achievementPopup}>
          <div className={styles.popupContent}>
            <div className={`${styles.achievementIcon} ${getDifficultyStyle(newAchievement.difficulty)}`}>
              {newAchievement.icon}
            </div>
            <div className={styles.popupText}>
              <h3>実績獲得！</h3>
              <h4>{newAchievement.title}</h4>
              <p>{newAchievement.description}</p>
            </div>
            <button 
              className={styles.closeButton}
              onClick={() => setShowAchievementPopup(false)}
            >
              ×
            </button>
          </div>
        </div>
      )}
      
      {/* 実績一覧 */}
      <div className={styles.header}>
        <h2 className={styles.title}>実績</h2>
        <div className={styles.stats}>
          <div className={styles.statItem}>
            <span className={styles.statValue}>{earnedAchievements.length}</span>
            <span className={styles.statLabel}>/{achievements?.length || 0}</span>
          </div>
        </div>
      </div>
      
      <div className={styles.achievementList}>
        {/* 獲得済み実績 */}
        {earnedAchievements.map(achievement => (
          <div 
            key={achievement.id} 
            className={`${styles.achievementCard} ${styles.earned}`}
          >
            <div className={`${styles.achievementIcon} ${getDifficultyStyle(achievement.difficulty)}`}>
              {achievement.icon}
            </div>
            <div className={styles.achievementInfo}>
              <h3 className={styles.achievementTitle}>{achievement.title}</h3>
              <p className={styles.achievementDescription}>{achievement.description}</p>
              <div className={styles.progressContainer}>
                <div className={styles.progressBar}>
                  <div 
                    className={styles.progressFill}
                    style={{ width: '100%' }}
                  ></div>
                </div>
                <span className={styles.progressText}>完了</span>
              </div>
            </div>
          </div>
        ))}
        
        {/* 未獲得の実績（showAllAchievementsがtrueの場合のみ表示） */}
        {showAllAchievements && achievements?.filter(
          achievement => !earnedAchievements.some(a => a.id === achievement.id)
        ).map(achievement => {
          const progress = calculateProgress(achievement);
          
          return (
            <div 
              key={achievement.id} 
              className={`${styles.achievementCard} ${progress > 0 ? styles.inProgress : styles.locked}`}
            >
              <div className={`${styles.achievementIcon} ${getDifficultyStyle(achievement.difficulty)} ${progress === 0 ? styles.locked : ''}`}>
                {achievement.icon}
              </div>
              <div className={styles.achievementInfo}>
                <h3 className={styles.achievementTitle}>
                  {progress === 0 && achievement.hidden ? '???' : achievement.title}
                </h3>
                <p className={styles.achievementDescription}>
                  {progress === 0 && achievement.hidden ? 'この実績は秘密です。プレイを続けて解除しましょう。' : achievement.description}
                </p>
                <div className={styles.progressContainer}>
                  <div className={styles.progressBar}>
                    <div 
                      className={styles.progressFill}
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                  <span className={styles.progressText}>{Math.round(progress)}%</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* すべての実績を表示/隠すボタン */}
      <button 
        className={styles.toggleButton}
        onClick={() => setShowAllAchievements(!showAllAchievements)}
      >
        {showAllAchievements ? '獲得済みの実績のみ表示' : 'すべての実績を表示'}
      </button>
    </div>
  );
}
