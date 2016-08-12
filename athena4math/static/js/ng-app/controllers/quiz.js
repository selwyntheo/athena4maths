angular.module('athena')
  .controller('QuizCtrl', function($scope, $window, $http, $location, $rootScope, $auth) {

  	$scope.quizName = '';


		    //Note: Only those configs are functional which is documented at: http://www.codeproject.com/Articles/860024/Quiz-Application-in-AngularJs
		    // Others are work in progress.
		    $scope.defaultConfig = {
		        'allowBack': true,
		        'allowReview': true,
		        'autoMove': false,  // if true, it will move to next question automatically when answered.
		        'duration': 0,  // indicates the time in which quiz needs to be completed. post that, quiz will be automatically submitted. 0 means unlimited.
		        'pageSize': 1,
		        'requiredAll': false,  // indicates if you must answer all the questions before submitting.
		        'richText': false,
		        'shuffleQuestions': false,
		        'shuffleOptions': false,
		        'showClock': false,
		        'showPager': true,
		        'theme': 'none'
		    }

		    $scope.goTo = function (index) {
		        if (index > 0 && index <= $scope.totalItems) {
		            $scope.currentPage = index;
		            $scope.mode = 'quiz';
		        }

		    }

		    $scope.onSelect = function (question, option) {
		    	console.log("Inside OnSelect")
		        if (question.QuestionTypeId == 1) {
		            question.Options.forEach(function (element, index, array) {
		                if (element.Id != option.Id) {
		                    element.Selected = false;
		                    question.Answered = element.Id;
		                }
		            });
		        }

		        if ($scope.config.autoMove == true && $scope.currentPage < $scope.totalItems)
		            $scope.currentPage++;
		    }

		    $scope.onSubmit = function () {
		        var answers = [];
		        $scope.questions.forEach(function (q, index) {
		            answers.push({ 'QuizId': $scope.quiz.Id, 'QuestionId': q.Id, 'Answered': q.Answered });
		        });
		        // Post your data to the server here. answers contains the questionId and the users' answer.
		        $http.post('/api/quiz/submit', answers).success(function (data, status) {
		            alert(data);
		        });
		        console.log($scope.questions);
		        $scope.mode = 'result';
		    }

		    $scope.pageCount = function () {
		        return Math.ceil($scope.questions.length / $scope.itemsPerPage);
		    };

		    //If you wish, you may create a separate factory or service to call loadQuiz. To keep things simple, i have kept it within controller.
		    $scope.loadQuiz = function () {
		        
		    	var quiz_url = '/quiz/1';

		    	$http({
					method: 'GET',
					url: quiz_url,
					params:null,
					data:null
				}).then(function(res){
					 $scope.quiz = res.data.quiz;
		             $scope.config = $scope.extend({}, $scope.defaultConfig, res.data.config);
		             $scope.questions = $scope.config.shuffleQuestions ? $scope.shuffle(res.data.questions) : res.data.questions;
		             $scope.totalItems = $scope.questions.length;
		             $scope.itemsPerPage = $scope.config.pageSize;
		             $scope.currentPage = 1;
		             $scope.mode = 'quiz';
		             if($scope.config.shuffleOptions)
		                $scope.shuffleOptions();

		             $scope.$watch('currentPage + itemsPerPage', function () {
		                 var begin = (($scope.currentPage - 1) * $scope.itemsPerPage),
		                   end = begin + $scope.itemsPerPage;

		                 $scope.filteredQuestions = $scope.questions.slice(begin, end);
		         
		             });
				}, function(error){
					$scope.quiz = [{ date: 'Server Error!', name: ''}];
				});

		    }
		    
		    $scope.shuffleOptions = function(){
		        $scope.questions.forEach(function (question) {
		           question.Options = $scope.shuffle(question.Options);
		        });
		    };
		    
		    $scope.loadQuiz();

		    $scope.isAnswered = function (index) {
		        var answered = 'Not Answered';
		        $scope.questions[index].Options.forEach(function (element, index, array) {
		            if (element.Selected == true) {
		                answered = 'Answered';
		                return false;
		            }
		        });
		        return answered;
		    };

		    $scope.isCorrect = function (question) {
		        var result = 'correct';
		        question.Options.forEach(function (option, index, array) {
		            if ($scope.toBool(option.Selected) != option.IsAnswer) {
		                result = 'wrong';
		                return false;
		            }
		        });
		        return result;
		    };

		 	$scope.toBool = function (val) {
            if (val == 'undefined' || val == null || val == '' || val == 'false' || val == 'False')
                return false;
            else if (val == true || val == 'true' || val == 'True')
                return true;
            else
                return 'unidentified';
	        };
	        $scope.shuffle = function (array) {
	            var currentIndex = array.length, temp, randomIndex;

	            while (0 !== currentIndex) {
	                randomIndex = Math.floor(Math.random() * currentIndex);
	                currentIndex -= 1;

	                temp = array[currentIndex];
	                array[currentIndex] = array[randomIndex];
	                array[randomIndex] = temp;
	            }
	            return array;
	        }
	        $scope.extend = function (out) {
	            out = out || {};

	            for (var i = 1; i < arguments.length; i++) {
	                if (!arguments[i])
	                    continue;

	                for (var key in arguments[i]) {
	                    if (arguments[i].hasOwnProperty(key))
	                        out[key] = arguments[i][key];
	                }
	            }
	            return out;
	        };


  });