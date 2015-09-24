# max_slice_big_o_n

Find the max sum slice of an array. Dynamic algorithm with Big O of n.

Try it out at https://jsbin.com/xopohe/1/edit?js,console

Write a max_slice function that takes an array of integers as input and returns the slice with the largest sum of elements.

# some examples:

[1,2,3] => [1,2,3]

[1,-2,3] => [3]

[1,-2,3, 4] => [3, 4]

[-1,-2,-3] => [-1]


Analysis

The n cubed and n squared algoritms determines the correct max_slice with the largest sum, however they are both slow.

Let's see if there is another faster way to approach this problem.

Consider the following examples.

[1, 2, 3 ,4]  

A series of only positive numbers with no negative numbers will always give the highest sum itself. In fact it is the negative numbers that will decrease the sum, and so we must pay special attention to them. 

max_slice([-1, -2, -3, 1, 2, 3, 4]) => [1, 2, 3, 4]

A series of positives preceded by a series of negatives will only result in the series of positives. Similarly a series of positives followed be a series of negatives will result in the negatives being thrown out.

max_slice([1, 2, 3, 4, -1, -2, -3, -4]) => [1, 2, 3, 4]

And so if a positive sequence is wrapped in two negative sequences, the negative sequences are thrown out.
max_slice([-1, -2, -3, 1, 2, 3, 4, -5, -6, -7]) => [1, 2, 3, 4]

So assuming there is at least one positive value in the sequence, a general rule can be applied that a negative seq that begins the input can be discarded, as well as a negative seq that ends the input, because these sequences can only decrease the sum.

Now let's consider what happens if we have a negative sequence that falls in between two positive sequences.

max_slice([1, 2, -5, 3, 4]) => [3, 4]

Now consider this.

max_slice([1, 2, -5, 3, 4, -8, 10, 2]) = [10, 2]

From these two examples it appears that we could isolate any positive sequences that are separated by negative sequences and then compare their sums. That is compare

[1, 2] with [3, 4] with [10, 2] and determine that [10, 2] is the highest sum. And then simply discard all negative sequences after using them to determine the boundaries of all the positive sequences. However, consider the following example.

max_slice([2, 5, -2, 3, 4, -5, 10, 1])

Is [10, 1] the largest sequence sum?

Let's look at all the positive sequence sums.

[1, 5] => 6
[3, 4] => 7
[10, 1] => 11

So [10, 1] is the largest of all these sequences. But is it the largest sequence in the entire input.

How bout the following sums?

[2, 5, -2, 3, 4] => 12
[3, 4, -5, 10, 1] => 13
[2, 5, -2, 3, 4, -5, 10, 1] => 18

It turns out that the entire input sequence with all negative numbers included has the largest sum. So we can not simply use the negative numbers as delimiters for the positive sequences, and then discard them as we did before in the negative number preceeding and/or negative number trailing case above. We have to consider the impact the negative numbers have on the total sum.

Consider the following:

[2, -1, 8]

For this example, it is worthwhile to include the negative value (-1) in the sum because both surrounding positive values (2 and 8) are larger than it so the benefit to the positive sum is more than the cost of the negative.

Now another example:

[1, -2, 8]

Here the cost of the negative value (-2) is more than the benefit of one of the positive values (1) and so for this example combining the sequence would decrease the sum.

So how do we come up with an algorithm that can handle a complicated input like this?

input = [2, 5, -2, 3, 4, -5, 10, 1]

First we need to bundle all the positive sequences together and all the negative sequences together. By doing this we can look across the negative sequences and determine if crossing the negative value has a net benefit to the sum. That results in the following:

combined_input = [7, -2, 7, -5, 11]

By looking at the combined input, it is obvious that each negative value should be crossed because there are larger positive values surrounding it.

However simply combining would cause us to lose the important information regarding where the start and end of each of the elements are. So we need to record that information. Two additional arrays can help with this a shown below.

Series Partial Sums

    start_index   end_index  partial_sum
0        0            1         7          // ie 5+2
1        2            2         -2         // ie -2
2        3            4         7          // ie 3+4
3        5            5         -5         // ie -5
4        6            7         11         // ie 10+1

Prior to running the combining part of the algorithm it initially sets its max value to the largest value in the input, with the max_slice indices set to the index of the largest value. It sets the max_sum to 10, and sets the max_slice = [6, 6] which is 10's index inside the input array. This max value will be used to compare against during the combining portion.

The combining loop only reads and writes from the first element, partial_sum[0]. The combiner will extract the first element, determine if it is negative. If it is negative, then we have a leading series of negative values which we previously said can only lower the sum. Therefore we do not combine and instead discard the negative series. If the value is positive, then we pull it off the partial_sum list and combine (add) it with the new element at the front of the partial_sum array (regardless if the new element is negative or positive). The combining of the positive extracted element with the new element at the front is how we determine if we should cross a negative series. If the result of the combining is negative, this means that the negative series was larger than the previous positive series and that we shouldn't further combine this negative series. Since this negative series is now at the front of the partial_sum array, it effectively is leading the array with a neagative series. And so the algoritm will discard it. If the result of the combining was a positive value, then crossing the negative series was 'worth it'. Then the algorithm will compare this new positive combined value with the current max sum, and if it is larger, will update the max_sum. Either way the algorithm will continue in this process.


The following traces the combining algorithm

Given:

input = [2, 5, -2, 3, 4, -5, 10, 1]

init max = 10, largest element in input

initially partial_sum = [7, -2, 7, -5, 11]


7 is extracted from partial_sum,  partial_sum = [-2, 7, -5, 11]
7 is combined with -2,            partial_sum = [5, 7, -5, 11],   // (7 + -2 ) = 5 > 0, combining across -2 increases the total sum
5 is extracted from partial_sum,  partial_sum = [7, -5, 11]
5 is combined with 7,             partial_sum = [12, -5, 11]
12 is extracted from partial_sum, partial_sum = [-5, 11]
12 is greater than the current max, so 12 is the new max now // 12>10
12 is combined wih -5,            partial_sum = [7, 11] // (12+ -5) = 7 > 0, combining across -5 increases the sum
7 is extrated from partial_sum,   partial_sum = [11]
7 is combined with 11,            partial_sum = [18]
18 is extracted from partial_sum, partial_sum = []
18 is greater than the current max, so 18 is the new max now // 18>12



Here is a trace of simpler input for the combiner

input = [1, -2, 4, -1, -1, 3]

From this input we expect the max_slice to be [4, -1, -1, 3], whose max is 5.

init max = 4, largest element in input

initially partial_sum = [1, -2, 4, -2, 3]

1 is extracted from partial_sum,  partial_sum = [-2, 4, -2, 3]
1 is combined with -2,            partial_sum = [-1, 4, -2, 3] // ( 1 + -2 ) = -1
-1 is extracted from partial_sum,  partial_sum = [4, -2, 3]
-1 is discarded since it is less than 0, ie. as if we have a series of leading negative values
4 is extracted from partial_sum,  partial_sum = [-2, 3]
4 is combined with -2,            partial_sum = [2, 3]   // (4 + -2) = 2
2 is extracted from partial_sum,  partial_sum = [3]
2 is combined with 3,             partial_sum = [5] // (2 + 3) = 5
5 is extracted from partial_sum,  partial_sum = []
5 is greater than the current max, so 5 is the new max now // 5 > 4


Timing

Since the algorithm only moves forward through the input, it has a linear timing function with a Big O of n.