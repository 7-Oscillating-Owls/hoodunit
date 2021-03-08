import React from 'react';
import styles from './AnswerModal.css';
import axios from 'axios';

class AnswerModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      answer: '',
      nickname: '',
      email: '',
      answerError: null,
      nicknameError: null,
      emailError: null,
    };
    this.validate = this.validate.bind(this);
    this.handleOnChange = this.handleOnChange.bind(this);
    this.handleSubmitClick = this.handleSubmitClick.bind(this);
    this.postAnswer = this.postAnswer.bind(this);
  }

  handleOnChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  handleSubmitClick(event) {
    event.preventDefault();
    this.validate();
    this.postAnswer();

  }

  validate() {
    const { answer, nickname, email } = this.state;

    { answer.length < 1 ? this.setState({ answerError: 'Please enter a answer' }) : this.setState({ answerError: null }) }
    { nickname.length < 1 ? this.setState({ nicknameError: 'Please enter a nickname' }) : this.setState({ nicknameError: null }) }
    { !email.includes('@') ? this.setState({ emailError: 'Please enter valid email' }) : this.setState({ emailError: null }) }
  }

  postAnswer() {
    const { answer, nickname, email } = this.state;
    const { questionId } = this.props;
    axios.post('/qa/postAnswer', {
      body: answer,
      nickname: nickname,
      email,
      questionId,
    })
      .then(() => { })
      .catch((err) => {
        console.log(err);
      });
  }
  render() {
    return (

      <div className={styles.AnswerModal}>
        <h3>Submit your Answer</h3>
        <form className={styles.modalform} onChange={this.handleOnChange}>
          <textarea
            type="text"
            name="answer"
            placeholder="Enter your Answer"
            maxLength="1000"
            className={styles.questionfield}
          />
          <small className={styles.errors}>{this.state.answerError}</small>
          <small>For privacy reasons, do not use your full name or email address</small>

          <input
            type="text"
            name="nickname"
            placeholder="Example: jackson11!"
            maxLength="60"
            className={styles.questionfield}
          />
          <small>For authentication reasons, you will not be emailed</small>
          <small className={styles.errors}>{this.state.nicknameError}</small>
          <input
            type="email"
            name="email"
            placeholder="enter email"
            maxLength="60"
            className={styles.questionfield}
          />
          <small className={styles.errors}>{this.state.emailError}</small>
          <small>For authentication reasons, you will not be emailed</small>
        </form>
        <button type="button" onClick={this.handleSubmitClick} className={styles.answerModalForm}>Submit</button>
      </div>
    );
  }
}

export default AnswerModal;
