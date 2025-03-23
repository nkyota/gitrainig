import { useState } from 'react';
import styles from '../styles/LessonContent.module.css';

export default function LessonContent({ lesson, onComplete }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  // レッスンが存在しない場合
  if (!lesson) {
    return (
      <div className={styles.container}>
        <div className={styles.emptyState}>
          <p>レッスンが選択されていません。</p>
        </div>
      </div>
    );
  }

  const { title, description, steps } = lesson;

  // 次のステップに進む
  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // レッスン完了
      setIsCompleted(true);
      if (onComplete) {
        onComplete(lesson.id);
      }
    }
  };

  // 前のステップに戻る
  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  // 現在のステップ
  const step = steps[currentStep];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>{title}</h2>
        <div className={styles.progress}>
          <div 
            className={styles.progressBar}
            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          ></div>
        </div>
      </div>

      <div className={styles.content}>
        {isCompleted ? (
          <div className={styles.completion}>
            <h3>レッスン完了！</h3>
            <p>{description}</p>
            <p>おめでとうございます！このレッスンを完了しました。</p>
            <button 
              className={styles.button}
              onClick={() => {
                setIsCompleted(false);
                setCurrentStep(0);
              }}
            >
              もう一度学習する
            </button>
          </div>
        ) : (
          <>
            <div className={styles.stepContent}>
              <h3 className={styles.stepTitle}>{step.title}</h3>
              <div className={styles.stepDescription}>
                {step.description}
              </div>
              
              {step.codeExample && (
                <div className={styles.codeBlock}>
                  <pre>
                    <code>{step.codeExample}</code>
                  </pre>
                </div>
              )}
              
              {step.image && (
                <div className={styles.imageContainer}>
                  <img 
                    src={step.image} 
                    alt={step.imageAlt || step.title} 
                    className={styles.image}
                  />
                </div>
              )}
            </div>

            <div className={styles.navigation}>
              <button 
                className={`${styles.button} ${currentStep === 0 ? styles.disabled : ''}`}
                onClick={prevStep}
                disabled={currentStep === 0}
              >
                前へ
              </button>
              <div className={styles.stepIndicator}>
                {currentStep + 1} / {steps.length}
              </div>
              <button 
                className={styles.button}
                onClick={nextStep}
              >
                {currentStep === steps.length - 1 ? '完了' : '次へ'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
