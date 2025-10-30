import { create } from "zustand";
import { produce, enableMapSet } from "immer";
import type {
  TQuestion,
  TQuestionsActions,
  TQuestionState,
} from "../types/question";
import type { TPagination } from "../types/pagination";
import type { TAnswer } from "../types/answer";
import type { TAttachment } from "../types/attachment";

enableMapSet(); // Enable Map & Set support for

type TUseQuestionStore = TQuestionState & TQuestionsActions;

const paginationInitialValues = {
  count: 0,
  limit: 0,
  hasNextItems: false,
  nextCursor: "",
};

export const useQuestionStore = create<TUseQuestionStore>((set) => ({
  questions: [],
  pagination: paginationInitialValues,

  updateAllQuestions: (questions: TQuestion[]) =>
    set(
      produce((state: TUseQuestionStore) => {
        state.questions = questions;
      })
    ),

  updateQuestion: (question: TQuestion) =>
    set(
      produce((state: TUseQuestionStore) => {
        const currQtnIndex = state.questions.findIndex(
          (qtn) => qtn.id === question.id
        );
        if (currQtnIndex === -1) {
          state.questions.push(question);
          return;
        }
        state.questions[currQtnIndex] = question;
      })
    ),

  updateQuestionAnswer: (answer: TAnswer) =>
    set(
      produce((state: TUseQuestionStore) => {
        const currQtnIndex = state.questions.findIndex(
          (qtn) => qtn.id === answer.questionID
        );

        if (currQtnIndex === -1) {
          console.log(
            "Question of the provided answer doesn't exist in the store!"
          );
          return;
        }

        const currQtn = state.questions[currQtnIndex];

        const currAnswerIndex = currQtn.answers.findIndex(
          (ans) => ans.id === answer.id
        );

        if (currAnswerIndex === -1) {
          currQtn.answers.push(answer);
          state.questions[currQtnIndex] = currQtn;
          return;
        }

        currQtn.answers[currAnswerIndex] = answer;
        state.questions[currQtnIndex] = currQtn;
      })
    ),

  updateQuestionAttachment: (attachment: TAttachment) =>
    set(
      produce((state: TUseQuestionStore) => {
        const currQtnIndex = state.questions.findIndex(
          (qtn) => qtn.id === attachment.questionID
        );
        if (currQtnIndex === -1) {
          console.log(
            "Question of the provided answer doesn't exist in the store!"
          );
          return;
        }

        const currQtn = state.questions[currQtnIndex];

        const currAttachmentIndex = currQtn.attachments.findIndex(
          (att) => att.id === attachment.id
        );

        if (currAttachmentIndex === -1) {
          currQtn.attachments.push(attachment);
          state.questions[currQtnIndex] = currQtn;
          return;
        }

        currQtn.attachments[currAttachmentIndex] = attachment;
        state.questions[currQtnIndex] = currQtn;
      })
    ),

  updateQuestionAnswerAttachment: (attachment: TAttachment) =>
    set(
      produce((state: TUseQuestionStore) => {
        let currQtnIndex: number = -1;
        let currAnswerIndex: number = -1;

        for (let qtnIndex = 0; qtnIndex < state.questions.length; qtnIndex++) {
          for (
            let ansIndex = 0;
            ansIndex < state.questions[qtnIndex].answers.length;
            ansIndex++
          ) {
            const currAnswer = state.questions[qtnIndex].answers[ansIndex];
            if (currAnswer.id === attachment.answerID) {
              currQtnIndex = qtnIndex;
              currAnswerIndex = ansIndex;
              break;
            }
          }
          if (currQtnIndex > -1) break;
        }

        if (currQtnIndex === -1) {
          console.log(
            "Question of the provided answer attachment doesn't exist in the store!"
          );
          return;
        }

        const currQtn = state.questions[currQtnIndex];
        const currAnswer = currQtn.answers[currAnswerIndex];

        const currAnswerAttachmentIndex = currAnswer.attachments.findIndex(
          (att) => att.id === attachment.id
        );

        if (currAnswerAttachmentIndex === -1) {
          currAnswer.attachments.push(attachment);
          currQtn.answers[currAnswerIndex] = currAnswer;
          state.questions[currQtnIndex] = currQtn;
          return;
        }

        currAnswer.attachments[currAnswerAttachmentIndex] = attachment;
        currQtn.answers[currAnswerIndex] = currAnswer;
        state.questions[currQtnIndex] = currQtn;
      })
    ),

  updatePagination: (pagination: TPagination) =>
    set(
      produce((state: TUseQuestionStore) => {
        state.pagination = pagination;
      })
    ),

  clearAll: () =>
    set(
      produce((state: TUseQuestionStore) => {
        state.questions = [];
        state.pagination = paginationInitialValues;
      })
    ),
}));
