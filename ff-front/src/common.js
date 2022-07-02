
import axios from 'axios';

export function getMonth(monthDt) {
    return new Promise((resolve, reject) => {
        axios({
            method: 'get',
            url: `http://localhost:3000/${monthDt}`
        }).then(response => resolve(response.data)).catch(error => reject(error));
    });
}

export function setMonth(monthDt, monthObj) {
    return new Promise((resolve, reject) => {
        axios({
            method: 'post',
            url: `http://localhost:3000/${monthDt}`,
            data: monthObj
        }).then(response => resolve(response.data)).catch(error => reject(error));
    });
}

export function updateSums(month) {

    let sum = 0;
    let total = 0;

    for (let indexBudget = 0; indexBudget < month.budget.length; indexBudget++) {
        total = 0;
        
        for (let indexForecast = 0; indexForecast < month.budget[indexBudget].forecast.length; indexForecast++) {
            sum = month.balance.reduce((pre, curr, i, arr) => {
                const value = curr.positive ? curr.value * -1 : curr.value;
                return curr.cat === month.budget[indexBudget].forecast[indexForecast].cat ? pre + value : pre;
            }, 0);

            month.budget[indexBudget].forecast[indexForecast].accomplished = sum;
            total += sum;
        }

        month.budget[indexBudget].totalAccomplished = total;
    }

    for (let indexRepo = 0; indexRepo < month.repos.length; indexRepo++) {
        sum = month.balance.reduce((pre, curr, i, arr) => {
            const value = curr.positive ? curr.value * -1 : curr.value;
            return curr.repo === month.repos[indexRepo].name ? pre + value : pre;
        }, 0);

        if (month.repos[indexRepo].isCredit) {
            month.repos[indexRepo].value.end = sum;
        }
        else {
            month.repos[indexRepo].value.end = month.repos[indexRepo].value.init - sum;
        }
    }

}