// middleware/validateAnswers.js
import Question from '../Database/questions.js';
import QuizResult from '../Database/quiz_results.js';
import mongoose from 'mongoose';

/**
 * Validates a student answer against the correct answer
 */
const checkCorrectAnswer = (question, studentAnswer) => {
  if (!studentAnswer) return false;
  
  // Handle multiple-choice questions
  if (question.questionType === "multiple-choice") {
    console.log(`[MC DEBUG] Question: ${question.title}`);
    console.log(`[MC DEBUG] Student answer: ${studentAnswer}`);
    console.log(`[MC DEBUG] Choices:`, question.choices);
    
    // Find the selected choice
    const selectedChoice = question.choices?.find(c => c.id === studentAnswer);
    console.log(`[MC DEBUG] Selected choice:`, selectedChoice);
    
    // If the student provided an answer ID that matches a choice with isCorrect=true
    if (selectedChoice?.isCorrect === true) {
      return true;
    }
    
    // Special case for instructor preview - the answer might be the content rather than the ID
    if (question.choices) {
      const correctChoice = question.choices.find(c => c.isCorrect === true);
      if (correctChoice && studentAnswer === correctChoice.text) {
        return true;
      }
    }
    
    return false;
  }
  
  // Handle true-false questions
  if (question.questionType === "true-false") {
    console.log(`[TF DEBUG] Question: ${question.title}`);
    console.log(`[TF DEBUG] Student answer: ${studentAnswer} (${typeof studentAnswer})`);
    console.log(`[TF DEBUG] Correct answer:`, question.correctAnswer);
    
    // Convert student answer to boolean
    const booleanStudentAnswer = 
      studentAnswer === true || 
      studentAnswer === "true" || 
      studentAnswer === "True";
    
    // Extract the correct boolean value from different possible formats
    let correctBooleanAnswer;
    
    if (typeof question.correctAnswer === 'boolean') {
      // Direct boolean
      correctBooleanAnswer = question.correctAnswer;
    } else if (typeof question.correctAnswer === 'string') {
      // String representation
      correctBooleanAnswer = 
        question.correctAnswer === "true" || 
        question.correctAnswer === "True";
    } else if (typeof question.correctAnswer === 'object' && question.correctAnswer !== null) {
      // Object with value property (could be boolean or string)
      if (typeof question.correctAnswer.value === 'boolean') {
        correctBooleanAnswer = question.correctAnswer.value;
      } else if (typeof question.correctAnswer.value === 'string') {
        correctBooleanAnswer = 
          question.correctAnswer.value === "true" || 
          question.correctAnswer.value === "True";
      }
    }
    
    console.log(`[TF DEBUG] Boolean student answer: ${booleanStudentAnswer}`);
    console.log(`[TF DEBUG] Boolean correct answer: ${correctBooleanAnswer}`);
    
    // Direct boolean comparison
    return booleanStudentAnswer === correctBooleanAnswer;
  }
  
  // Handle fill-in-blank questions
  if (question.questionType === "fill-in-blank") {
    console.log(`[FIB DEBUG] Question: ${question.title}`);
    console.log(`[FIB DEBUG] Student answer: ${studentAnswer}`);
    
    // Get all possible correct answers
    let possibleAnswers = [];
    
    // Extract from answers array
    if (question.answers && Array.isArray(question.answers)) {
      const answers = question.answers.map(ans => 
        typeof ans === 'object' && ans.value ? ans.value : ans
      ).filter(Boolean);
      possibleAnswers = [...possibleAnswers, ...answers];
    }
    
    // Extract from possibleAnswers array
    if (question.possibleAnswers && Array.isArray(question.possibleAnswers)) {
      const answers = question.possibleAnswers.map(ans => 
        typeof ans === 'object' && ans.value ? ans.value : ans
      ).filter(Boolean);
      possibleAnswers = [...possibleAnswers, ...answers];
    }
    
    // Check correctAnswers array
    if (question.correctAnswers && Array.isArray(question.correctAnswers)) {
      possibleAnswers = [...possibleAnswers, ...question.correctAnswers.filter(Boolean)];
    }
    
    // Check single correctAnswer value
    if (question.correctAnswer) {
      if (Array.isArray(question.correctAnswer)) {
        possibleAnswers = [...possibleAnswers, ...question.correctAnswer.filter(Boolean)];
      } else if (typeof question.correctAnswer === 'object' && question.correctAnswer.value) {
        possibleAnswers.push(question.correctAnswer.value);
      } else {
        possibleAnswers.push(question.correctAnswer);
      }
    }
    
   
    
    // Special handling for equations
    const isMathExpression = studentAnswer.includes('+') || 
                           studentAnswer.includes('*') || 
                           studentAnswer.includes('-');
                           
    if (isMathExpression) {
      // For math expressions like thrust equation
      const normalizeMathExpr = (expr) => {
        return expr.toString()
           .toLowerCase()
           .replace(/\s+/g, '')
           .replace(/m(dot|̇)/g, 'mdot')
           .replace(/ṁ/g, 'mdot')
           .replace(/[×⋅*]/g, '')
           .replace(/\//g, '')
           .replace(/p_?2\s*-\s*p_?1/g, 'p2p1')
           .replace(/\(|\)/g, '');
      };
      
      const normalizedStudentAnswer = normalizeMathExpr(studentAnswer);
      
      console.log(`[FIB DEBUG] Normalized student answer: ${normalizedStudentAnswer}`);
      console.log(`[FIB DEBUG] Possible answers:`, possibleAnswers);
      
      return possibleAnswers.some(answer => {
        if (!answer) return false;
        
        const normalizedAnswer = normalizeMathExpr(String(answer));
        console.log(`[FIB DEBUG] Comparing with: ${normalizedAnswer}`);
        
        // Direct comparison
        if (normalizedStudentAnswer === normalizedAnswer) {
          console.log(`[FIB DEBUG] Direct match!`);
          return true;
        }
        
        // Term-by-term comparison for addition expressions
        if (normalizedStudentAnswer.includes('+') && normalizedAnswer.includes('+')) {
          const studentTerms = normalizedStudentAnswer.split('+').map(t => t.trim()).sort();
          const answerTerms = normalizedAnswer.split('+').map(t => t.trim()).sort();
          
          if (studentTerms.length === answerTerms.length) {
            const termsMatch = studentTerms.every((term, i) => term === answerTerms[i]);
            if (termsMatch) {
              console.log(`[FIB DEBUG] Terms match!`);
              return true;
            }
          }
        }
        
        return false;
      });
    }
    
    // Standard string comparison for non-math expressions
    console.log(`[FIB DEBUG] Possible answers:`, possibleAnswers);
    const isCorrect = possibleAnswers.some(answer => {
      const result = studentAnswer.toLowerCase().trim() === String(answer).toLowerCase().trim();
      if (result) console.log(`[FIB DEBUG] Match found with: ${answer}`);
      return result;
    });
    
    return isCorrect;
  }
  
  return false;
};

/**
 * Middleware for validating quiz answers
 */
export const validateQuizAnswers = async (req, res) => {
  try {
    const { quizId, userId, answers } = req.body;
    console.log('Validating quiz:', quizId);
    console.log('User ID:', userId);
    console.log('Answers received:', answers);
    
    // Get quiz questions with correct answers
    console.log('Searching for questions with quizId:', quizId);
    const questions = await Question.find({ quizId: quizId });
    console.log('Found questions count:', questions.length);
    
    if (questions.length === 0) {
      console.log('No questions found for quiz:', quizId);
      return res.status(404).json({ error: 'Questions not found for this quiz' });
    }
    
    // Log found questions (just IDs and titles for brevity)
    console.log('Found questions:', questions.map(q => ({ _id: q._id, title: q.title })));
    
    // Validate each answer and calculate score
    let score = 0;
    const feedback = {};
    let totalPoints = 0;
    
    for (const question of questions) {
      const studentAnswer = answers[question._id];
      const isCorrect = checkCorrectAnswer(question, studentAnswer);
      totalPoints += question.points || 0;
      
      if (isCorrect) {
        score += question.points || 0;
      }
      
      feedback[question._id] = { 
        isCorrect,
        studentAnswer,
        points: question.points,
        earnedPoints: isCorrect ? question.points : 0
      };
    }
    
    // Determine if the attempt passes (e.g., score >= 60% of total)
    const percentage = totalPoints > 0 ? (score / totalPoints) * 100 : 0;
    const passed = percentage >= 60; // Passing threshold
    
    // Create or update quiz result in database
    const existingResult = await QuizResult.findOne({ quizId, userId });
    const currentDate = new Date();
    // Generate a MongoDB ObjectId for attemptId
    const attemptId = new mongoose.Types.ObjectId();
    
    if (existingResult) {
      // Only update if score is higher than previous attempt
      if (score > existingResult.score) {
        existingResult.score = score;
        existingResult.answers = answers;
        existingResult.feedback = feedback;
        existingResult.attemptCount = (existingResult.attemptCount || 0) + 1;
        existingResult.submittedAt = currentDate;
        existingResult.attemptId = attemptId;
        existingResult.passed = passed;
        existingResult.maxScore = totalPoints;
        await existingResult.save();
      } else {
        existingResult.attemptCount = (existingResult.attemptCount || 0) + 1;
        await existingResult.save();
      }
    } else {
      // Create new result
      await QuizResult.create({
        quizId,
        userId,
        score,
        totalPoints,
        answers,
        feedback,
        attemptCount: 1,
        submittedAt: currentDate,
        attemptId: attemptId,
        passed: passed,
        maxScore: totalPoints
      });
    }
    
    res.json({ 
      score, 
      totalPoints,
      feedback,
      percentage: Math.round(percentage)
    });
  } catch (err) {
    console.error('Error validating quiz answers:', err.message);
    res.status(500).json({ error: err.message });
  }
};