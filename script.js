let expression = document.getElementById(`expression`)
let parseButton = document.getElementById(`parseButton`)
let visualizeButton = document.getElementById(`visualizeButton`)
let answerParagraph = document.getElementById(`answerParagraph`)

let visual
let expressionValue
let termsToReplace

parseButton.addEventListener(`click`, parse)
visualizeButton.addEventListener(`click`, visualize)

expression.addEventListener(`keydown`, keyPressed)
expression.focus()

function parse() {
  visual = false
  parseExpression()
}

function visualize() {
  visual = true
  parseExpression()
}

function parseExpression() {
  expressionValue = expression.value.replace(/ /g, ``)
  termsToReplace = []
  answerParagraph.innerHTML = ``

  let answer = evalExpression(expressionValue)

  if (!isNaN(answer)) {
    answerParagraph.innerHTML += answer
  } else {
    answerParagraph.innerHTML = `Invalid expression.`
  }
}

function evalExpression(expression) {
  let obj = extractTermsOperators(expression)
  evalTerms(obj.terms)

  return applyOperators(obj.terms, obj.operators)
}

function extractTermsOperators(expression) {
  let terms = []
  let operators = []

  let parenCount = 0
  let term = ``

  for (let character of expression) {
    if (character == `(`) {
      parenCount++
    } else if (character == `)`) {
      parenCount--
    }

    if (parenCount == 0 && `+-*/`.includes(character)) {
      terms.push(term)
      operators.push(character)
      term = ``
    } else {
      term += character
    }
  }

  terms.push(term)

  return {
    terms: terms,
    operators: operators,
  }
}

function evalTerms(terms) {
  for (let i = 0; i < terms.length; i++) {
    if (terms[i] == ``) {
      terms[i] = NaN
    } else if (!isNaN(terms[i])) {
      terms[i] = Number(terms[i])
    } else {
      let firstChar = terms[i][0]
      let lastChar = terms[i][terms[i].length - 1]

      if (firstChar != `(` || lastChar != `)`) {
        terms[i] = NaN
      } else {
        let subexpression = terms[i].substring(1, terms[i].length - 1)
        termsToReplace.push(terms[i])

        terms[i] = evalExpression(subexpression)

        if (visual) {
          let termToReplace = termsToReplace.pop()
          expressionValue = expressionValue.replace(termToReplace, terms[i])

          for (let j = 0; j < termsToReplace.length; j++) {
            termsToReplace[j] = termsToReplace[j].replace(termToReplace, terms[i])
          }

          answerParagraph.innerHTML += `${expressionValue}<br><br>`
        }
      }
    }
  }
}

function applyOperators(terms, operators) {
  let answer = terms[0]

  for (let i = 0; i < operators.length; i++) {
    if (operators[i] == `+`) {
      answer += terms[i + 1]
    } else if (operators[i] == `-`) {
      answer -= terms[i + 1]
    } else if (operators[i] == `*`) {
      answer *= terms[i + 1]
    } else if (operators[i] == `/`) {
      answer /= terms[i + 1]
    }
  }

  return answer
}

function keyPressed(event) {
  if (event.keyCode == 13) {
    parseExpression()
  }
}
