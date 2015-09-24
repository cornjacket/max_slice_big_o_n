var debug = 0; // set to 1 for display info

function debug_log(string) {
  if (debug) {
    console.log(string);
  }
}

function max_slice(input) {
  var max_sum = input[0];
  var slice   = [0,0];
  
  //var debug = 1;
  
  debug_log("first max_sum = "+max_sum+" at "+slice); 
  // choose max_sum to be largest element
  for (start=0; start<input.length; start+=1) {
    if (input[start] >= max_sum) {
      max_sum = input[start];
      slice   = [start, start];
    }
  }
  debug_log("max element's max_sum = "+max_sum+" at "+slice); 
  
  // combine sequential positives and negatives together keeping track of their start
  // and end indices
  var start_index = [];
  var end_index   = [];
  var partial_sum = [];
  var is_neg_sequence = (input[0] < 0) ? true : false;
  var done = false;
  
  var running_sum = input[0];
  var start = 0;
  var end   = 0;
  
  // combine all positive streaks and negative streaks together, respectively
  while (!done) {
    
    if ((is_neg_sequence && input[end+1]<0) || (!is_neg_sequence && input[end+1]>=0)) {
      // keep going, it's still negative or still positive
      end += 1;
      // add the next number to the current running sum
      running_sum += input[end];
    } else {
      // now we are going positive or going negative
      is_neg_sequence = !is_neg_sequence;
      // record the sum and indices
      start_index.push(start);
      end_index.push(end);
      partial_sum.push(running_sum);
      start = end+1;
      // reset the running_sum
      running_sum = 0;
    }
    done = (end === input.length-1);   
  }
  partial_sum.push(running_sum); // last one needs to be added
  start_index.push(start);
  end_index.push(end);
  
  debug_log("input below");
  debug_log(input);
  debug_log("partial_sum below");
  debug_log(partial_sum);
  debug_log("start_index below");
  debug_log(start_index);
  debug_log("end_index below");
  debug_log(end_index);
  
  ////////////////////////////////////////////////////////////////////
  
  // now let's iterate the partial_sums and further combine when beneficial and
  // throw away any leading negatives or any negatives that we form. we will always
  // be looking at the first element, modifying the first element, and removing the 
  // first element. the algorithm will stop when we either have 1 or 0 elements left
    
  debug_log("Begin merging positive and negative streaks");
  var current_sum;
  var current_start_index;
  var current_end_index;
  while (partial_sum.length !== 0) {
    
    current_sum = partial_sum.shift(); // save the top non-neg item
    current_start_index = start_index.shift();
    current_end_index   = end_index.shift();
    // discard negative and zero sequences since they dont contribute to larger sums
    // discard translates to not processing the negative and moving on to the next
    if (current_sum > 0) { 
      debug_log("current_sum = "+current_sum+" start = "+current_start_index+" end = "+current_end_index);
      // check for new max
      if (current_sum >= max_sum) {
        max_sum = current_sum;
        slice   = [current_start_index, current_end_index];
        debug_log("new max = "+max_sum+" at "+slice);
      }
      if (partial_sum.length !== 0) { 
        // perform the merge
        debug_log("merge made");
        partial_sum[0] += current_sum; 
        start_index[0] = current_start_index; 
      }
     
    }
    else {
      debug_log(current_sum+" discarded");
    }
    if (partial_sum.length !== 0) debug_log("current partial_sum = "+partial_sum);
  }
  
  
  var result = [];
  for (var index = slice[0]; index <= slice[1]; index+=1) {
    result.push(input[index]);
  }
  return result;
  
}

//console.log(max_slice([1, 2, 3]));   // expect [1, 2, 3]
//console.log(max_slice([1, -2, 3]));  // expect [3]
//console.log(max_slice([1, -1, 3, 4])); // expect [3, 4]
//console.log(max_slice([-1, -2, -3]));  // expect [-1]
// there must be a more elegant way to combine, maybe a reduce or something ... DRT
//console.log(max_slice([2, -1, 3])); // expect [2, -1, 3]
//console.log(max_slice([1, 2, -1, -2])); // expect [1,2]
//console.log(max_slice([-1, -2, 1, 2, -4, -5, 4, 5, -6])); // expect [4,5]
console.log(max_slice([2, 5, -2, 3, 4, -5, 10, 1])); // expect [2, 5, -2, 3, 4, -5, 10, 1]

