import React from 'react';
import axios from 'axios';
import styles from './QuestionsAndAnswers.css';
import Question from '../Question';
import QATitle from '../QATitle';
import AddAQuestion from '../AddAQuestion';
import SearchBar from '../SearchBar';
import MoreAnsweredQuestions from '../MoreAnsweredQuestions';
import Questiontwo from '../Questiontwo';
import Answerlist from '../Answerlist';
import Answerlisttwo from '../Answerlisttwo';
import QuestionMore from '../QuestionMore';

class QuestionsAndAnswers extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      isMore: false,
      searchTerm: '',
    };
    this.handleMoreClick = this.handleMoreClick.bind(this);
    this.handleOnChange = this.handleOnChange.bind(this);
    this.getQuestions = this.getQuestions.bind(this);
  }

  componentDidMount() {
    this.getQuestions();
  }

  handleOnChange(event) {
    this.setState({ searchTerm: event.target.value });
  }

  handleMoreClick() {
    this.setState({ isMore: true });
  }
  getQuestions() {
    const { productId } = this.props;
    axios.get('/qa', {
      params: {
        productId: productId
      },
    })
    .then((response) => {
      this.setState({
         data: response.data.results
        });
    })
    .catch((error) => {
      console.log('error fetching questions')
    })
  }

  render() {
    const { data, isMore, searchTerm } = this.state;
    // const filteredItem = data.filter(item => {
    //   return item.data.question_body.toLowerCase().includes(searchTerm.toLowerCase())
    // });
    return (
      <div>
        <QATitle />
        <div className={styles.searchContainer}>
          <SearchBar change={this.handleOnChange} />
        </div>
        <div className={styles.questionone}>
          <Question data={data} />
          <Answerlist />
          <Questiontwo data={data} />
          <Answerlisttwo />
          {isMore ? <QuestionMore data={data} /> : null }
        </div>

        <div className={styles.button}>
          <MoreAnsweredQuestions click={this.handleMoreClick} />
          <AddAQuestion productId ={this.props.productId} />
        </div>
      </div>
    );
  }
}

export default QuestionsAndAnswers;
