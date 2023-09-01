import axios from "axios";

/**
 * It returns a random color in the format "rgba(r, g, b, a)".
 * @returns A string.
 */
function getRandomColor() {
	var color = "rgba(";
	for (var i = 0; i < 3; i++) {
		color += Math.floor(Math.random() * 200 + 50).toString();
		color += ", ";
	}
	color += "0.3 )";
	return color;
}

/**
 * It takes an object with tags as keys and objects with pass and wrong counts as values, and returns
 * an object that can be used to create a bar chart using Chart.js.
 * @param obj - The object that you want to convert to a chart.js object.
 * @param [threshold=0] - The minimum number of times a tag has to be used to be included in the chart.
 * @returns An object with the following structure:
 * {
 *   labels: [],
 *   datasets: [
 *     {
 *       data: [],
 *       backgroundColor: [],
 *       borderWidth: 1
 *     }
 *   ]
 * }
 */
function get_accuracy_obj_for_CharJS(obj, threshold = 1) {
	let finalObj = {};
	finalObj.labels = [];
	finalObj.datasets = [];
	let sorted_tags = Object.entries(obj).sort(
		(a, b) =>
			a[1].pass / (a[1].pass + a[1].wrong) -
			b[1].pass / (b[1].pass + b[1].wrong)
	);
	let accuracy = [];
	let backgroundColor = [];
	let total_submission = [];
	for (let i = 0; i < sorted_tags.length; i++) {
		let correct_count = sorted_tags[i][1].pass;
		let wrong_count = sorted_tags[i][1].wrong;
		if (correct_count + wrong_count >= threshold) {
			finalObj.labels.push(
				sorted_tags[i][0] +
					" : " +
					(correct_count + wrong_count).toString()
			);
			total_submission.push(correct_count + wrong_count);
			accuracy.push(
				parseFloat(
					(correct_count / (correct_count + wrong_count)) * 100
				).toFixed(2)
			);
			backgroundColor.push(getRandomColor());
		}
	}
	total_submission = total_submission.sort(
		(a, b) => parseFloat(a) - parseFloat(b)
	);
	let data_obj = {};
	data_obj.data = accuracy;
	data_obj.thresholdSubmission = Math.min(
		Math.max(total_submission[Math.ceil(total_submission.length / 2)], 10),
		25
	);
	data_obj.backgroundColor = backgroundColor;
	data_obj.borderWidth = 1;
	finalObj.datasets.push(data_obj);
	return finalObj;
}

export async function get_questions_user(user) {
	const data = await axios
		.get(
			"https://codeforces.com/api/user.status?handle=" +
				user +
				"&from=1&count=100000000"
		)
		.then((response) => {
			return response.data;
		});
	return data;
}

/**
 * It takes an array of objects, and returns an object that contains accuracy for each respective tags which is used for creating a chart
 * @param data - The data that you want to get the tags from.
 * @param [threshold=0] - The minimum number of submissions for a tag to be considered.
 * @returns An object with two keys: labels and datasets.
 */
export function get_tags_accuracy(data, threshold = 0) {
	let obj = {};
	let tags_obj = {};
	tags_obj.labels = [];
	tags_obj.datasets = [];

	for (let i = 0; i < data.length; i++) {
		let verdict = data[i].verdict === "OK" ? 1 : 0;
		data[i].problem.tags.map((data) => {
			if (!(data in obj)) {
				obj[data] = {};
				obj[data].pass = 0;
				obj[data].wrong = 0;
			}
			if (verdict === 1) {
				obj[data].pass += 1;
			} else {
				obj[data].wrong += 1;
			}
		});
	}

	let sorted_tags = Object.entries(obj).sort(
		(a, b) =>
			a[1].pass / (a[1].pass + a[1].wrong) -
			b[1].pass / (b[1].pass + b[1].wrong)
	);
	let accuracy = [];
	let backgroundColor = [];
	for (let i = 0; i < sorted_tags.length; i++) {
		let correct_count = sorted_tags[i][1].pass;
		let wrong_count = sorted_tags[i][1].wrong;
		if (correct_count + wrong_count >= threshold) {
			tags_obj.labels.push(
				sorted_tags[i][0] +
					" : " +
					(correct_count + wrong_count).toString()
			);
			accuracy.push(
				parseFloat(
					(correct_count / (correct_count + wrong_count)) * 100
				).toFixed(2)
			);
			backgroundColor.push(getRandomColor());
		}
	}
	let data_obj = {};
	data_obj.data = accuracy;
	data_obj.backgroundColor = backgroundColor;
	data_obj.borderWidth = 1;
	tags_obj.datasets.push(data_obj);
	// console.log(tags_obj);
	return tags_obj;
}

/**
 * It takes an array of objects, and returns an object that can be used to create a chart.js chart.
 * @param data - the data that you want to process
 * @param [threshold=0] - the minimum number of submissions for a question to be considered.
 * @returns An object with the following structure:
 * {
 *   labels: [],
 *   datasets: []
 * }
 */
export function get_questions_accuracy(data, threshold = 0) {
	let obj = {};

	for (let i = 0; i < data.length; i++) {
		let verdict = data[i].verdict === "OK" ? 1 : 0;
		let question = data[i].problem.index;
		if (!(question in obj)) {
			obj[question] = {};
			obj[question].pass = 0;
			obj[question].wrong = 0;
		}
		if (verdict === 1) {
			obj[question].pass += 1;
		} else {
			obj[question].wrong += 1;
		}
	}
	// console.log("obj", obj);
	return get_accuracy_obj_for_CharJS(obj, threshold);
}

export function get_rating_tags_accuracy(data, threshold = 0) {
	// console.log(threshold)
	let obj = {};
	let ratingArray = [];

	for (let i = 0; i < data.length; i++) {
		let verdict = data[i].verdict === "OK" ? 1 : 0;
		let rating = data[i].problem.index;
		if (!(rating in obj)) {
			ratingArray.push(rating);
			obj[rating] = {};
		}
		data[i].problem.tags.map((data) => {
			if (!(data in obj[rating])) {
				obj[rating][data] = {};
				obj[rating][data].pass = 0;
				obj[rating][data].wrong = 0;
			}
			if (verdict === 1) {
				obj[rating][data].pass += 1;
			} else {
				obj[rating][data].wrong += 1;
			}
		});
	}
	let retArray = [];
	ratingArray = ratingArray.sort();
	// console.log(ratingArray);
	ratingArray.map((rating) => {
		let ratingObj = get_accuracy_obj_for_CharJS(obj[rating]);
		let finalObj = {};
		finalObj.rating = "Codeforces accuracy for Rating " + rating;
		finalObj.ratingObj = ratingObj;
		retArray.push(finalObj);
	});
	// console.log("rating tags", retArray);
	return retArray;
}
