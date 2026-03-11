export const questionBank = [
    {
        id: 101,
        question: "If A = {1, 2} and B = {2, 3}, what is A ∩ B?",
        options: ["{1, 2, 3}", "{2}", "{1, 3}", "{}"],
        correctAnswer: "{2}",
        difficulty: 1,
        topic: "Sets",
        hint: "Look for elements that are present in BOTH sets.",
        adaptiveHints: {
            L1: "Which set operation examines membership in both operands simultaneously?",
            L2: "Intersection (∩) finds elements common to BOTH sets. Check each element of A: is it also in B? Start with 1 — is 1 in {2, 3}?",
            L3: "Let's break this down! Imagine Set A = {1, 2} is a bag of fruits and Set B = {2, 3} is another bag. Intersection (∩) means finding fruits that appear in BOTH bags. Check each item: Is '1' in bag B? No. Is '2' in bag B? Yes! So the intersection is just {2}. You're doing great!"
        }
    },
    {
        id: 102,
        question: "What is the binary representation of decimal 10?",
        options: ["1010", "1001", "1100", "0101"],
        correctAnswer: "1010",
        difficulty: 1,
        topic: "Binary",
        hint: "8 + 2 = 10. Think about the powers of 2: 8, 4, 2, 1.",
        adaptiveHints: {
            L1: "How would you express 10 as a sum of distinct powers of 2?",
            L2: "Binary uses place values 8, 4, 2, 1 (right to left). To convert 10: does 8 fit? Yes (10-8=2). Does 4 fit in 2? No. Does 2 fit? Yes (2-2=0). Does 1 fit? No. So the digits are 1, 0, 1, 0.",
            L3: "Think of binary like a set of light switches for values 8, 4, 2, and 1. To make 10, which switches do you turn on? Start with the biggest: 8 fits into 10 (switch ON, remainder = 2). 4 doesn't fit into 2 (switch OFF). 2 fits into 2 (switch ON, remainder = 0). 1 is not needed (switch OFF). Reading the switches: 1-0-1-0. You've got this!"
        }
    },
    {
        id: 103,
        question: "Which of the following is a tautology?",
        options: ["p ∧ q", "p ∨ ¬p", "p → q", "¬(p ∨ q)"],
        correctAnswer: "p ∨ ¬p",
        difficulty: 2,
        topic: "Logic",
        hint: "A tautology is always true. Consider 'It is raining OR it is not raining'.",
        adaptiveHints: {
            L1: "Which expression remains true regardless of the truth value assigned to p?",
            L2: "A tautology is a statement that is ALWAYS true. Think about p ∨ ¬p: if p is true, the OR is true. If p is false, ¬p is true, so the OR is still true. Which option follows this pattern?",
            L3: "A tautology means 'always true no matter what'. Let's test p ∨ ¬p with a real example: 'It is raining OR it is NOT raining.' If it IS raining, the first part is true — so the whole thing is true. If it's NOT raining, the second part is true — still true! There's no way this can be false. That's what makes it a tautology. Look for this pattern in the options!"
        }
    },
    {
        id: 104,
        question: "Calculate the determinant of a 2x2 identity matrix.",
        options: ["0", "1", "2", "Undefined"],
        correctAnswer: "1",
        difficulty: 2,
        topic: "Matrices",
        hint: "The identity matrix has 1s on the diagonal and 0s elsewhere. ad - bc.",
        adaptiveHints: {
            L1: "What is the determinant formula for a 2×2 matrix, and what values populate the identity matrix?",
            L2: "The 2×2 identity matrix is [[1,0],[0,1]]. The determinant formula is ad - bc. Here, a=1, b=0, c=0, d=1. Substitute and compute: what is (1×1) - (0×0)?",
            L3: "Let's solve this step by step! The identity matrix looks like: [1, 0] on the top row and [0, 1] on the bottom row. For any 2×2 matrix [[a, b], [c, d]], the determinant = a×d - b×c. So we plug in: a=1, b=0, c=0, d=1. That gives us (1×1) - (0×0) = 1 - 0 = 1. The identity matrix always has a determinant of 1!"
        }
    },
    {
        id: 105,
        question: "In a directed graph, the sum of degrees is equal to?",
        options: ["2 * |E|", "|V|", "|E|", "2 * |V|"],
        correctAnswer: "2 * |E|",
        difficulty: 3,
        topic: "Graph Theory",
        hint: "Each edge has a start and an end. It contributes to the degree twice.",
        adaptiveHints: {
            L1: "Consider how each edge contributes to the total degree count from both its endpoints.",
            L2: "In any graph, each edge connects two vertices. It adds 1 to the degree of each endpoint. So every single edge contributes exactly 2 to the total degree sum. If there are |E| edges, what's the total?",
            L3: "Think of edges like handshakes between people (vertices). Each handshake involves exactly 2 people, so it gets counted twice — once for each person. If there are 3 handshakes (edges), the total count is 3 × 2 = 6. In general, the sum of all degrees = 2 × number of edges. This is called the Handshaking Lemma. You can do this!"
        }
    },
    {
        id: 106,
        question: "A function f: A -> B is injective if:",
        options: ["f(x) = f(y) implies x = y", "For all y in B, there exists x in A", "f(x) = y", "A = B"],
        correctAnswer: "f(x) = f(y) implies x = y",
        difficulty: 2,
        topic: "Functions",
        hint: "Injective means 'one-to-one'. Distinct inputs map to distinct outputs.",
        adaptiveHints: {
            L1: "What formal condition guarantees that no two distinct domain elements share the same image?",
            L2: "Injective (one-to-one) means no two different inputs can give the same output. Formally: if f(x) = f(y), then x must equal y. Which option captures this 'no collisions' rule?",
            L3: "Imagine a function as a machine: you put something in, you get something out. 'Injective' means each output is unique — no two different inputs produce the same output. Like student IDs: two different students can't have the same ID. The formal way to say this: if f(x) = f(y), then x MUST equal y. Look for the option that says exactly this!"
        }
    },
    {
        id: 107,
        question: "How many ways can 5 books be arranged on a shelf?",
        options: ["120", "20", "25", "60"],
        correctAnswer: "120",
        difficulty: 1,
        topic: "Combinatorics",
        hint: "This is a permutation of 5 items. 5!",
        adaptiveHints: {
            L1: "How does the factorial function apply to ordering n distinct objects?",
            L2: "Arranging items is a permutation problem. For the first slot you have 5 choices, then 4, then 3, and so on. The total is 5! = 5 × 4 × 3 × 2 × 1. What does that equal?",
            L3: "Think of placing books one at a time on a shelf. For the first position, you can pick any of the 5 books. For the second position, 4 books remain. Then 3, then 2, then 1. Multiply them all: 5 × 4 × 3 × 2 × 1 = 120. This is called '5 factorial' and is written as 5!. You're doing great — it's just counting step by step!"
        }
    },
    {
        id: 108,
        question: "Probability of getting heads in a fair coin toss?",
        options: ["0.5", "1", "0", "0.25"],
        correctAnswer: "0.5",
        difficulty: 1,
        topic: "Probability",
        hint: "There are two equally likely outcomes: Heads or Tails.",
        adaptiveHints: {
            L1: "What is the ratio of favorable outcomes to total outcomes in a symmetric binary experiment?",
            L2: "Probability = favorable outcomes / total outcomes. A fair coin has 2 sides, and 'heads' is 1 of those outcomes. So P(heads) = 1/2. What is that as a decimal?",
            L3: "A fair coin has exactly two sides: Heads and Tails. Both are equally likely. Probability is calculated as: (what you want) ÷ (total possibilities). You want heads — that's 1 outcome. Total possibilities = 2 (heads or tails). So probability = 1 ÷ 2 = 0.5. That means there's a 50% chance! Nice and simple!"
        }
    },
    {
        id: 109,
        question: "De Morgan's First Law states ¬(A ∧ B) is equivalent to:",
        options: ["¬A ∨ ¬B", "¬A ∧ ¬B", "A ∨ B", "¬A ∨ B"],
        correctAnswer: "¬A ∨ ¬B",
        difficulty: 2,
        topic: "Boolean Algebra",
        hint: "The negation of AND is the OR of the negations.",
        adaptiveHints: {
            L1: "How does De Morgan's law transform the negation of a conjunction?",
            L2: "De Morgan's First Law: negating an AND flips it to OR, and negates each operand. So ¬(A ∧ B) becomes ¬A ∨ ¬B. The 'shape' changes (∧→∨) and each variable gets negated.",
            L3: "Let's use a real example! 'NOT (it's sunny AND warm)' means the same as 'it's NOT sunny OR it's NOT warm.' De Morgan's rule says: when you negate an AND, you break it apart into OR and negate each piece. So ¬(A ∧ B) = ¬A ∨ ¬B. Remember: the connector flips (AND→OR) and each part gets a NOT. You've got this!"
        }
    },
    {
        id: 110,
        question: "What is the GCD of 8 and 12?",
        options: ["4", "2", "8", "24"],
        correctAnswer: "4",
        difficulty: 1,
        topic: "Number Theory",
        hint: "List the factors: 8 -> 1,2,4,8; 12 -> 1,2,3,4,6,12.",
        adaptiveHints: {
            L1: "Apply the Euclidean algorithm or factor decomposition to find the greatest common divisor.",
            L2: "The GCD is the largest number that divides BOTH 8 and 12. Factors of 8: {1, 2, 4, 8}. Factors of 12: {1, 2, 3, 4, 6, 12}. What's the biggest number in both lists?",
            L3: "The GCD (Greatest Common Divisor) is the biggest number that divides evenly into both numbers. Let's list the factors: 8 can be divided by 1, 2, 4, 8. And 12 can be divided by 1, 2, 3, 4, 6, 12. Now find the numbers that appear in BOTH lists: 1, 2, 4. The greatest (biggest) of those is 4. So GCD(8, 12) = 4. Well done!"
        }
    },
    {
        id: 111,
        question: "If set A has 3 elements, how many elements are in its Power Set?",
        options: ["8", "6", "9", "3"],
        correctAnswer: "8",
        difficulty: 2,
        topic: "Sets",
        hint: "The size of the power set is 2^n.",
        adaptiveHints: {
            L1: "What is the cardinality of the power set P(A) expressed in terms of |A|?",
            L2: "The power set contains ALL possible subsets, including the empty set and the set itself. The formula is |P(A)| = 2^n where n = |A|. With 3 elements, that's 2^3. What does that equal?",
            L3: "The power set of A is the set of ALL possible subsets of A. If A = {a, b, c}, the subsets are: {}, {a}, {b}, {c}, {a,b}, {a,c}, {b,c}, {a,b,c}. Count them: that's 8! The pattern is always 2^n, where n is the number of elements. So 2^3 = 8. Think of each element as having two choices: 'in' or 'out' of a subset. You're on the right track!"
        }
    },
    {
        id: 112,
        question: "The contrapositive of p → q is:",
        options: ["¬q → ¬p", "q → p", "¬p → ¬q", "¬p ∨ q"],
        correctAnswer: "¬q → ¬p",
        difficulty: 2,
        topic: "Logic",
        hint: "Swap the order and negate both parts.",
        adaptiveHints: {
            L1: "What transformation yields the logically equivalent contrapositive of an implication?",
            L2: "The contrapositive reverses and negates both sides. p → q becomes ¬q → ¬p. This is NOT the same as the converse (q → p) or inverse (¬p → ¬q). Which option shows the correct swap-and-negate?",
            L3: "Let's use an example: 'If it rains, then the ground is wet' (p → q). The contrapositive flips it around AND negates both parts: 'If the ground is NOT wet, then it did NOT rain' (¬q → ¬p). Two steps: (1) swap the order, (2) negate both. The contrapositive is always logically equivalent to the original! Look for ¬q → ¬p in the options."
        }
    },
    {
        id: 113,
        question: "A tree with n vertices has how many edges?",
        options: ["n - 1", "n", "n + 1", "2n"],
        correctAnswer: "n - 1",
        difficulty: 2,
        topic: "Graph Theory",
        hint: "A tree is minimally connected. It has one less edge than vertices.",
        adaptiveHints: {
            L1: "What is the fundamental relationship between vertices and edges in a connected acyclic graph?",
            L2: "A tree is a connected graph with no cycles. Each new vertex added to a tree requires exactly one new edge. Starting from 1 vertex (0 edges), n vertices gives n-1 edges. This is a defining property of trees.",
            L3: "Think of building a tree step by step. Start with 1 dot (vertex) — no lines (edges) needed. Add a second dot and connect it: 2 vertices, 1 edge. Add a third dot and connect it: 3 vertices, 2 edges. See the pattern? Each new vertex adds exactly 1 edge. So n vertices always have n - 1 edges. This is one of the most important facts about trees!"
        }
    },
    {
        id: 114,
        question: "If Matrix A is 2x3 and B is 3x2, the product AB is:",
        options: ["2x2", "3x3", "2x3", "Undefined"],
        correctAnswer: "2x2",
        difficulty: 2,
        topic: "Matrices",
        hint: "Inner dimensions match (3=3). Result is Outer x Outer.",
        adaptiveHints: {
            L1: "When the inner dimensions of two matrices agree, what determines the dimensions of their product?",
            L2: "For matrix multiplication A(m×n) × B(n×p), the inner dimensions (n) must match. The result is m×p. Here A is 2×3 and B is 3×2: inner dimensions are both 3 (match!), so the result is the outer dimensions: 2×2.",
            L3: "Matrix multiplication works like this: A is 2×3 (2 rows, 3 columns) and B is 3×2 (3 rows, 2 columns). First check: can we multiply? The columns of A (3) must equal the rows of B (3). Yes, they match! The result takes the rows of A (2) and columns of B (2). So AB = 2×2 matrix. Think: (2×3) × (3×2) → keep the outer numbers → 2×2!"
        }
    },
    {
        id: 115,
        question: "A relation R is transitive if (a,b)∈R and (b,c)∈R implies:",
        options: ["(a,c)∈R", "(c,a)∈R", "(b,a)∈R", "(c,b)∈R"],
        correctAnswer: "(a,c)∈R",
        difficulty: 2,
        topic: "Relations",
        hint: "If a connects to b, and b connects to c, then a connects to c.",
        adaptiveHints: {
            L1: "What pair must belong to R to satisfy the chain condition from a through b to c?",
            L2: "Transitivity creates a 'chain': if a is related to b, and b is related to c, then a must be related to c. Think of it as: the relation 'jumps over' the middle element b. Which pair completes the chain?",
            L3: "Think of 'taller than': If Alice is taller than Bob, and Bob is taller than Charlie, then Alice must be taller than Charlie. That's transitivity! The relation chains through the middle person. With (a,b) and (b,c), the chain goes a→b→c, so the conclusion must be (a,c). The first and last elements get connected! You've got this!"
        }
    },
    {
        id: 116,
        question: "Union of sets {1, 2} and {2, 3} is:",
        options: ["{1, 2, 3}", "{2}", "{1, 2, 2, 3}", "{}"],
        correctAnswer: "{1, 2, 3}",
        difficulty: 1,
        topic: "Sets",
        hint: "Combine all unique elements from both sets.",
        adaptiveHints: {
            L1: "What is the result of combining all distinct members from both sets?",
            L2: "Union (∪) means 'everything in either set'. Collect all elements from {1, 2} and {2, 3}, but don't repeat. Remember: sets don't have duplicates. What unique elements do you get?",
            L3: "Union means combining everything together! Take all items from the first set {1, 2} and all items from the second set {2, 3}. Put them together: 1, 2, 2, 3. But wait — sets can't have duplicates! So remove the extra 2. Final answer: {1, 2, 3}. Union = 'everything from both, no repeats.' Simple as that!"
        }
    },
    {
        id: 117,
        question: "Hexadecimal digit 'F' represents decimal:",
        options: ["15", "16", "14", "12"],
        correctAnswer: "15",
        difficulty: 1,
        topic: "Binary",
        hint: "A=10, B=11... count up to F.",
        adaptiveHints: {
            L1: "In base-16, what decimal value does the sixth letter of the alphabet represent?",
            L2: "Hex uses 0-9 then A-F for values 10-15. A=10, B=11, C=12, D=13, E=14, F=? Just continue the count by one more.",
            L3: "Hexadecimal is base-16, so it needs 16 symbols. After 0-9, we use letters: A=10, B=11, C=12, D=13, E=14, F=15. Think of it as counting on your fingers past 9 and using letters instead. F is the last hex digit before we'd need a new place value (10 in hex = 16 in decimal). So F = 15!"
        }
    },
    {
        id: 118,
        question: "The symbol ↔ represents:",
        options: ["Biconditional", "Implication", "Conjunction", "Disjunction"],
        correctAnswer: "Biconditional",
        difficulty: 1,
        topic: "Logic",
        hint: "It means 'if and only if' (bi-directional condition).",
        adaptiveHints: {
            L1: "Which logical connective does the double-headed arrow symbolize?",
            L2: "The ↔ symbol has arrows pointing in BOTH directions, meaning the condition works both ways: p ↔ q means 'p if and only if q'. This is called the bi-conditional. It's true when both sides have the same truth value.",
            L3: "Look at the symbol ↔ — it has arrows going both ways! In logic: → means 'implies' (one direction). ↔ means 'implies in BOTH directions' — if p then q, AND if q then p. We call this 'biconditional' or 'if and only if.' Think of it as: both sides must be equal (both true or both false). The 'bi' prefix means 'two' — two directions!"
        }
    },
    {
        id: 119,
        question: "Formula for Combinations C(n, k) is:",
        options: ["n! / (k!(n-k)!)", "n! / (n-k)!", "n! * k!", "n! / k!"],
        correctAnswer: "n! / (k!(n-k)!)",
        difficulty: 2,
        topic: "Combinatorics",
        hint: "Order does not matter in combinations, so we divide by k!.",
        adaptiveHints: {
            L1: "How does the combination formula adjust the permutation count to account for order irrelevance?",
            L2: "Combinations start with permutations P(n,k) = n!/(n-k)! but then divide by k! because order doesn't matter. So C(n,k) = n! / (k!(n-k)!). The k! removes duplicate orderings of the same group.",
            L3: "Let's build the formula step by step! First, the number of ways to arrange k items from n is n!/(n-k)! (permutation). But in combinations, order doesn't matter — ABC is the same as BAC. How many ways can k items be rearranged? That's k!. So we divide by k! to remove duplicates: C(n,k) = n! / (k! × (n-k)!). The denominator has TWO factorials multiplied together!"
        }
    },
    {
        id: 120,
        question: "Probability of rolling a 7 with a standard 6-sided die?",
        options: ["0", "1/6", "1", "1/7"],
        correctAnswer: "0",
        difficulty: 1,
        topic: "Probability",
        hint: "The maximum value on a standard die is 6.",
        adaptiveHints: {
            L1: "Can the sample space of a standard die include a value of 7?",
            L2: "A standard die has faces numbered 1 through 6. Since 7 is not on any face, the probability of an impossible event is 0. P(event) = favorable outcomes / total outcomes = 0/6 = 0.",
            L3: "A standard die has exactly 6 faces: 1, 2, 3, 4, 5, and 6. There is NO face with the number 7. Since it's impossible to roll a 7, the probability is 0. Remember: probability ranges from 0 (impossible) to 1 (certain). Rolling a 7 on a 6-sided die is impossible, so P = 0. Don't overthink this one — it's simpler than it looks!"
        }
    },
    {
        id: 121,
        question: "A graph has an Euler Path if it has:",
        options: ["0 or 2 odd degree vertices", "All even degree vertices", "No odd degree vertices", "Connected vertices"],
        correctAnswer: "0 or 2 odd degree vertices",
        difficulty: 3,
        topic: "Graph Theory",
        hint: "You need to enter and leave every node, except possibly the start and end.",
        adaptiveHints: {
            L1: "What constraint on vertex degrees distinguishes Euler paths from Euler circuits?",
            L2: "An Euler path visits every edge exactly once. For this to work, at most 2 vertices can have odd degree (these are the start and end points). 0 odd-degree vertices means it's actually an Euler circuit (start = end). So the answer is 0 or 2.",
            L3: "An Euler path is a path that uses every edge exactly once. Think of drawing a shape without lifting your pen. At each vertex, you need to enter and leave — that requires an even degree. BUT the start and end points are exceptions: you leave the start without entering, and enter the end without leaving. So at most 2 vertices can have odd degree (start and end). If 0 have odd degree, you end where you started (Euler circuit)!"
        }
    },
    {
        id: 122,
        question: "Max nodes in a binary tree of height h (root at 0)?",
        options: ["2^(h+1) - 1", "2^h", "2^h - 1", "2^(h-1)"],
        correctAnswer: "2^(h+1) - 1",
        difficulty: 2,
        topic: "Trees",
        hint: "Level 0 has 1, Level 1 has 2... Sum of geometric series.",
        adaptiveHints: {
            L1: "What is the closed-form sum of 2^0 + 2^1 + ... + 2^h?",
            L2: "At each level i, a full binary tree has 2^i nodes. Total = 2^0 + 2^1 + ... + 2^h. This geometric series sums to 2^(h+1) - 1. With root at height 0, h=2 gives: 1 + 2 + 4 = 7 = 2^3 - 1.",
            L3: "Let's count level by level! Level 0 (root): 1 node. Level 1: 2 nodes. Level 2: 4 nodes. Level 3: 8 nodes. See the pattern? Each level has 2^level nodes. To get the max total, add them all up: 1 + 2 + 4 + ... + 2^h. This is a geometric series that equals 2^(h+1) - 1. For example, height 2: 1+2+4 = 7 = 2^3 - 1. You're doing awesome!"
        }
    },
    {
        id: 123,
        question: "A matrix has an inverse if its determinant is:",
        options: ["Non-zero", "Zero", "Positive", "Negative"],
        correctAnswer: "Non-zero",
        difficulty: 2,
        topic: "Matrices",
        hint: "Division by zero is undefined. The determinant acts like a scaling factor.",
        adaptiveHints: {
            L1: "What condition on the determinant ensures the existence of a multiplicative matrix inverse?",
            L2: "The inverse formula involves dividing by the determinant: A^(-1) = (1/det(A)) × adj(A). If det(A) = 0, we'd be dividing by zero — undefined! So the matrix is invertible only when det(A) ≠ 0.",
            L3: "Think of the determinant like a key to unlock the inverse. The inverse formula requires dividing by the determinant. We know dividing by zero is impossible! So: if determinant = 0, no inverse exists (the matrix is 'singular'). If determinant ≠ 0 (any non-zero value, positive OR negative), the inverse exists. The answer is simply: non-zero. It doesn't need to be positive or negative specifically!"
        }
    },
    {
        id: 124,
        question: "Relation R on set A is reflexive if:",
        options: ["For all a in A, (a,a) in R", "For all a,b, (a,b) in R -> (b,a) in R", "For no a, (a,a) in R", "R is empty"],
        correctAnswer: "For all a in A, (a,a) in R",
        difficulty: 2,
        topic: "Relations",
        hint: "Every element must be related to itself.",
        adaptiveHints: {
            L1: "What does the 'self-loop' condition require for every element in the domain?",
            L2: "Reflexive means every element is related to itself. Formally: for every a ∈ A, the pair (a, a) must be in R. Think of it as every person being their own friend. Don't confuse with symmetric (which is about (a,b)→(b,a)).",
            L3: "Reflexive comes from 'reflect' — like looking in a mirror, every element must 'see itself.' In a relation, this means every element a must be paired with itself: (a, a) must be in R. Example: 'is equal to' is reflexive because every number equals itself (5 = 5). Look for the option that says 'for all a, (a,a) is in R.' That's the reflexive condition!"
        }
    },
    {
        id: 125,
        question: "Which pattern represents a tautology?",
        options: ["All True in truth table", "All False", "Mixed True/False", "None"],
        correctAnswer: "All True in truth table",
        difficulty: 1,
        topic: "Logic",
        hint: "A tautology is always true, no matter the inputs.",
        adaptiveHints: {
            L1: "What truth table pattern characterizes a statement that is valid under all interpretations?",
            L2: "A tautology is a logical formula that evaluates to TRUE for every possible combination of inputs. In a truth table, this means the result column contains nothing but 'True' values. No exceptions.",
            L3: "A truth table lists every possible combination of True/False inputs and shows the result. A tautology is a formula that is ALWAYS true — no matter what you plug in. So in the truth table, every single row in the result column shows 'True.' If even one row is False, it's not a tautology. The answer is: 'All True in truth table.' Think of it as a formula that can never fail!"
        }
    },
    {
        id: 126,
        question: "Boolean expression A + 1 equals:",
        options: ["1", "A", "0", "A'"],
        correctAnswer: "1",
        difficulty: 1,
        topic: "Boolean Algebra",
        hint: "In Boolean algebra, 1 represents 'True'. OR-ing with True is always True.",
        adaptiveHints: {
            L1: "What is the identity element behavior when OR-ing any variable with the universal set?",
            L2: "In Boolean algebra, '+' means OR. The rule is: anything OR 1 = 1. Since 1 represents 'True', OR-ing anything with True always gives True. A + 1 = 1 regardless of what A is.",
            L3: "In Boolean algebra, '+' means OR (not addition!). The value 1 means True. Let's check both cases: If A = 0: 0 OR 1 = 1 ✓. If A = 1: 1 OR 1 = 1 ✓. No matter what A is, when you OR it with 1, the result is always 1. This is called the 'annulment law' — 1 dominates in OR operations, just like 0 dominates in AND operations."
        }
    },
    {
        id: 127,
        question: "Set A is a subset of B if:",
        options: ["Every element of A is in B", "A = B", "Some elements of A are in B", "B is empty"],
        correctAnswer: "Every element of A is in B",
        difficulty: 1,
        topic: "Sets",
        hint: "Think of A being completely 'inside' B.",
        adaptiveHints: {
            L1: "What containment condition must hold between every member of A and the set B?",
            L2: "A ⊆ B means every element in A must also be in B. It doesn't require A = B (A can be smaller). And 'some elements' isn't enough — it must be ALL elements. Check each option carefully.",
            L3: "Think of sets as circles in a Venn diagram. A is a subset of B when A's circle fits completely inside B's circle. Every single element in A must also be found in B. For example: {1, 2} ⊆ {1, 2, 3} because both 1 and 2 are in the bigger set. It doesn't have to be equal — A can be smaller. The key word is 'every element.' You've got this!"
        }
    },
    {
        id: 128,
        question: "Which symbol denotes 'For All'?",
        options: ["∀", "∃", "∈", "⊂"],
        correctAnswer: "∀",
        difficulty: 1,
        topic: "Logic",
        hint: "It looks like an inverted 'A' (for All).",
        adaptiveHints: {
            L1: "Which quantifier symbol is the inverted form of the first letter it represents?",
            L2: "The universal quantifier 'For All' uses the symbol ∀ — an upside-down A. Compare: ∃ means 'there exists,' ∈ means 'is an element of,' and ⊂ means 'is a subset of.'",
            L3: "Let's match each symbol: ∀ = 'for all' (looks like an upside-down 'A' — A for All!). ∃ = 'there exists' (upside-down E for Exists). ∈ = 'is an element of' (like the letter 'e' for element). ⊂ = 'is a proper subset of.' The question asks for 'For All,' so look for the inverted A!"
        }
    },
    {
        id: 129,
        question: "The set of all actual outputs of a function is its:",
        options: ["Range", "Domain", "Codomain", "Inverse"],
        correctAnswer: "Range",
        difficulty: 1,
        topic: "Functions",
        hint: "Domain is inputs, Codomain is potential outputs, Range is actual outputs.",
        adaptiveHints: {
            L1: "Which term specifically denotes the image of the entire domain under the function?",
            L2: "The domain is the set of inputs. The codomain is all POSSIBLE outputs. The range (or image) is the set of ACTUAL outputs — the values the function really produces. These can differ: codomain includes values that might not actually get mapped to.",
            L3: "Think of a vending machine: the domain is the buttons you can press (inputs). The codomain is everything the machine could theoretically dispense. The range is what it ACTUALLY dispenses. If the machine has 10 types of snacks but only 7 are in stock, the codomain is 10 and the range is 7. The range = actual outputs. That's your answer!"
        }
    },
    {
        id: 130,
        question: "Number of permutations of 'ABC'?",
        options: ["6", "3", "9", "27"],
        correctAnswer: "6",
        difficulty: 1,
        topic: "Combinatorics",
        hint: "3 positions, 3 letters. 3 x 2 x 1.",
        adaptiveHints: {
            L1: "How many distinct orderings exist for 3 unique elements?",
            L2: "A permutation is an ordered arrangement. For 3 distinct items, the count is 3! = 3 × 2 × 1. If you list them: ABC, ACB, BAC, BCA, CAB, CBA — that's 6.",
            L3: "Let's list all the arrangements! Pick the first letter: 3 choices (A, B, or C). Pick the second: 2 remaining choices. Pick the third: 1 left. Total = 3 × 2 × 1 = 6. Let's verify: ABC, ACB, BAC, BCA, CAB, CBA. Count: 6! Whenever you arrange n different items, the answer is n! (n factorial)."
        }
    },
    {
        id: 131,
        question: "If P(A) = 0.5, P(B) = 0.5, and independent, P(A and B) = ?",
        options: ["0.25", "0.5", "1", "0"],
        correctAnswer: "0.25",
        difficulty: 2,
        topic: "Probability",
        hint: "For independent events, multiply their probabilities.",
        adaptiveHints: {
            L1: "What multiplication rule applies when two events have no influence on each other's occurrence?",
            L2: "For independent events, P(A ∩ B) = P(A) × P(B). This is the multiplication rule for independence. Just plug in: 0.5 × 0.5 = ?",
            L3: "When two events are independent, they don't affect each other — like flipping two coins. The probability of BOTH happening is found by multiplying: P(A and B) = P(A) × P(B). So: 0.5 × 0.5 = 0.25. Think of it as: there's a 50% chance of A, and of those times, only 50% will also have B. Half of a half = a quarter = 0.25!"
        }
    },
    {
        id: 132,
        question: "Number of edges in Complete Graph K4?",
        options: ["6", "4", "12", "16"],
        correctAnswer: "6",
        difficulty: 2,
        topic: "Graph Theory",
        hint: "Formula: n(n-1)/2.",
        adaptiveHints: {
            L1: "Apply the complete graph edge formula to determine |E| when n = 4.",
            L2: "In a complete graph K_n, every vertex connects to every other. The number of edges = n(n-1)/2. For K4: 4 × 3 / 2 = 12/2. This avoids double-counting each edge.",
            L3: "In K4, every vertex connects to every other vertex. With 4 vertices, each connects to 3 others. That's 4 × 3 = 12 connections. But wait — this counts each edge twice (once from each end). So divide by 2: 12 ÷ 2 = 6 edges. Think of it like handshakes: in a group of 4, how many unique handshakes? Each person shakes 3 hands, but each handshake involves 2 people. Answer: 6!"
        }
    },
    {
        id: 133,
        question: "A leaf node in a tree has degree:",
        options: ["1 (if connected)", "0", "2", "3"],
        correctAnswer: "1 (if connected)",
        difficulty: 1,
        topic: "Trees",
        hint: "A leaf is an end-point. It connects to only one parent or neighbor.",
        adaptiveHints: {
            L1: "What is the degree of a terminal vertex in a tree?",
            L2: "In graph theory, a leaf (terminal node) has exactly 1 edge connecting it to the rest of the tree — its parent. Degree = number of edges incident to a vertex. So a leaf's degree is 1.",
            L3: "In a tree, a leaf is a node at the very end — like a leaf on a real tree branch. It connects to only one other node (its parent). The 'degree' of a node is how many edges touch it. Since a leaf has exactly one connection, its degree = 1. Think about it: if it had 0 connections, it would be floating alone (not connected). If it had 2+, it wouldn't be a leaf!"
        }
    },
    {
        id: 134,
        question: "Transpose of Row Matrix is:",
        options: ["Column Matrix", "Square Matrix", "Identity Matrix", "Zero Matrix"],
        correctAnswer: "Column Matrix",
        difficulty: 1,
        topic: "Matrices",
        hint: "Transposing flips rows to columns.",
        adaptiveHints: {
            L1: "What geometric transformation does transposition perform on a matrix's orientation?",
            L2: "Transposing a matrix swaps its rows and columns. A row matrix (1×n) becomes a column matrix (n×1) after transposition. The values stay the same, just the layout changes.",
            L3: "Transposing a matrix is like rotating it — rows become columns and columns become rows. A row matrix is a single horizontal row, like [1, 2, 3]. When you transpose it, it becomes a vertical column: [1] [2] [3]. That's a column matrix! Think of it as tipping the matrix on its side. Simple swap!"
        }
    },
    {
        id: 135,
        question: "Equivalence relations are Reflexive, Symmetric, and:",
        options: ["Transitive", "Antisymmetric", "Injective", "Connected"],
        correctAnswer: "Transitive",
        difficulty: 2,
        topic: "Relations",
        hint: "Think of 'equals' (=). If a=b and b=c, then a=c.",
        adaptiveHints: {
            L1: "What third property, along with reflexivity and symmetry, defines an equivalence relation?",
            L2: "Equivalence relations have three properties: Reflexive (a~a), Symmetric (a~b → b~a), and Transitive (a~b ∧ b~c → a~c). Think 'RST' — the third letter is T for Transitive.",
            L3: "An equivalence relation is like 'equals' — it groups things that are 'the same' in some way. It needs three properties: (1) Reflexive: everything equals itself (a = a ✓). (2) Symmetric: if a = b, then b = a ✓. (3) The missing one: if a = b and b = c, then a = c. This is called 'Transitive' — the relationship chains through! Remember: RST = Reflexive, Symmetric, Transitive."
        }
    },
    {
        id: 136,
        question: "Smallest prime number?",
        options: ["2", "1", "3", "0"],
        correctAnswer: "2",
        difficulty: 1,
        topic: "Number Theory",
        hint: "1 is not prime. 2 is the only even prime.",
        adaptiveHints: {
            L1: "Which is the smallest natural number with exactly two distinct positive divisors?",
            L2: "A prime number has exactly 2 factors: 1 and itself. 1 only has one factor (itself), so it's NOT prime. 0 is not prime either. The smallest number with exactly 2 factors is 2 (factors: 1 and 2).",
            L3: "Let's check each option! A prime number is divisible only by 1 and itself (exactly 2 factors). 0: has infinite divisors — not prime. 1: only has one factor (1) — not prime (needs exactly 2 factors!). 2: factors are 1 and 2 — that's exactly 2 factors — PRIME! ✓ 3: also prime, but not the smallest. So the smallest prime is 2. Fun fact: it's also the only even prime number!"
        }
    },
    {
        id: 137,
        question: "Set difference A - B contains:",
        options: ["Elements in A not in B", "Elements in B not in A", "Elements in both", "Elements in neither"],
        correctAnswer: "Elements in A not in B",
        difficulty: 1,
        topic: "Sets",
        hint: "It removes any elements belonging to B from A.",
        adaptiveHints: {
            L1: "What elements remain after removing from A those that also belong to B?",
            L2: "Set difference A - B keeps only elements that are in A but NOT in B. It's like taking A and 'subtracting' everything that B has in common. For example: {1,2,3} - {2,3,4} = {1}.",
            L3: "Think of A - B as starting with everything in A, then removing anything that's also in B. Example: if A = {1, 2, 3} and B = {2, 3, 4}. Start with A: {1, 2, 3}. Remove items found in B: 2 is in B, remove it. 3 is in B, remove it. 1 is NOT in B, keep it! Result: {1}. A - B = elements in A that are NOT in B. The order matters: A - B ≠ B - A!"
        }
    },
    {
        id: 138,
        question: "17 mod 5 is:",
        options: ["2", "3", "1", "0"],
        correctAnswer: "2",
        difficulty: 1,
        topic: "Number Theory",
        hint: "Divide 17 by 5. What is the remainder?",
        adaptiveHints: {
            L1: "What remainder does the division algorithm yield for 17 divided by 5?",
            L2: "The mod operation gives the remainder after division. 17 ÷ 5 = 3 remainder ?. Since 5 × 3 = 15, and 17 - 15 = 2, the remainder (mod) is 2.",
            L3: "Mod means 'remainder after division.' Let's do it step by step: How many times does 5 fit into 17? 5 × 1 = 5, 5 × 2 = 10, 5 × 3 = 15, 5 × 4 = 20 (too big!). So 5 goes into 17 exactly 3 times (5 × 3 = 15). What's left over? 17 - 15 = 2. That remainder is your answer: 17 mod 5 = 2. Think of mod as 'what's left after you take away as many 5s as you can.'"
        }
    },
    {
        id: 139,
        question: "XOR of 1 and 1 is:",
        options: ["0", "1", "2", "11"],
        correctAnswer: "0",
        difficulty: 1,
        topic: "Binary",
        hint: "XOR is true only if inputs are DIFFERENT.",
        adaptiveHints: {
            L1: "What does the exclusive-OR operation yield when both operands are identical?",
            L2: "XOR (exclusive OR) outputs 1 only when inputs differ. Same inputs → 0, different inputs → 1. Since both inputs are 1 (same), XOR = 0. Truth table: 0⊕0=0, 0⊕1=1, 1⊕0=1, 1⊕1=0.",
            L3: "XOR stands for 'eXclusive OR.' It means 'one or the other, but NOT both.' Think of it like a toggle: are the inputs different? If yes → 1 (true). If no → 0 (false). Here both inputs are 1 — they're the SAME, not different. So XOR = 0. Quick reference: 0 XOR 0 = 0 (same → 0), 0 XOR 1 = 1 (different → 1), 1 XOR 0 = 1 (different → 1), 1 XOR 1 = 0 (same → 0). You've got this!"
        }
    },
    {
        id: 140,
        question: "Chromatic number of a K3 graph?",
        options: ["3", "2", "1", "4"],
        correctAnswer: "3",
        difficulty: 2,
        topic: "Graph Theory",
        hint: "K3 is a triangle. Each node connects to every other node.",
        adaptiveHints: {
            L1: "For a complete graph on 3 vertices, what is the minimum number of colors needed for a proper coloring?",
            L2: "K3 is a triangle — every vertex connects to every other. Since all 3 vertices are mutually adjacent, each needs a different color. You can't reuse any color because every pair shares an edge. So χ(K3) = 3.",
            L3: "K3 is a triangle with 3 vertices, all connected to each other. The chromatic number is the minimum colors needed so no two connected vertices share a color. Vertex A connects to B and C — so A, B, C all need different colors. Can we use 2 colors? Color A red, B blue — but C connects to both A and B, so C can't be red or blue. We need a third color! Answer: 3 colors, which equals the number of vertices in a complete graph."
        }
    }
];

export const getRandomQuestions = (count) => {
    const shuffled = [...questionBank].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
};

// =============================================================
// FIXED A/B TEST QUESTIONS - Same 5 for both Test A and Test B
// 3 Easy (2 Knowledge + 1 Math) | 1 Medium (Math) | 1 Hard (Math)
// =============================================================
export const AB_TEST_QUESTIONS = [
    {
        id: 118,
        question: "The symbol ↔ represents:",
        options: ["Biconditional", "Implication", "Conjunction", "Disjunction"],
        correctAnswer: "Biconditional",
        difficulty: 1,
        topic: "Logic",
        // TEST A - Generic one-liner (deliberately vague)
        testAHint: "Think about what the arrows in the symbol might suggest.",
        // TEST B - Three clearly different levels
        testBHints: {
            L1: "What does it mean when an arrow points in both directions at once?",
            L2: "This symbol has arrows going **both ways**, meaning the condition works in **both directions**. Compare it with → which only goes one way. Which word means 'works both ways'?",
            L3: "Let's look at the symbol closely! ↔ has arrows pointing **left and right**, both directions. In logic, → means 'if...then' (one direction). So ↔ means the condition works **both ways**: 'if p then q' AND 'if q then p'. The word for this is **biconditional**, 'bi' means two, so it's a two-way condition. You're doing great, just match the symbol to its name!"
        }
    },
    {
        id: 129,
        question: "The set of all actual outputs of a function is its:",
        options: ["Range", "Domain", "Codomain", "Inverse"],
        correctAnswer: "Range",
        difficulty: 1,
        topic: "Functions",
        // TEST A - Generic one-liner (deliberately vague)
        testAHint: "Consider what comes out of a function versus what goes in.",
        // TEST B - Three clearly different levels
        testBHints: {
            L1: "Which term describes only the values a function actually produces, not just what it could produce?",
            L2: "There are three key terms: **Domain** = inputs, **Codomain** = all possible outputs, **Range** = the outputs that actually happen. The question asks about 'actual outputs', so which term matches that?",
            L3: "Think of a vending machine! The **domain** is the buttons you press (inputs). The **codomain** is everything the machine could theoretically give you. The **range** is what it actually dispenses, the real outputs. The question asks for 'actual outputs', which is the **range**. Don't mix it up with codomain (that's all *possible* outputs). Keep going, you've got this!"
        }
    },
    {
        id: 108,
        question: "Probability of getting heads in a fair coin toss?",
        options: ["0.5", "1", "0", "0.25"],
        correctAnswer: "0.5",
        difficulty: 1,
        topic: "Probability",
        // TEST A - Generic one-liner (deliberately vague)
        testAHint: "Think about how many possible outcomes there are.",
        // TEST B - Three clearly different levels
        testBHints: {
            L1: "What fraction of the total outcomes does 'heads' represent in a fair experiment?",
            L2: "Probability = **what you want** ÷ **total possibilities**. A fair coin has exactly 2 sides. You want heads, which is 1 of those 2 sides. What's 1 divided by 2?",
            L3: "Let's break this down! A fair coin has exactly **2 sides**: Heads and Tails. Both are equally likely. To find the probability: take **(what you want)** and divide by **(everything that could happen)**. You want Heads, that's **1** outcome. Total possibilities = **2** outcomes. So probability = 1 ÷ 2 = **0.5** (which means 50%). That's it, nice and simple, you've got this!"
        }
    },
    {
        id: 109,
        question: "De Morgan's First Law states ¬(A ∧ B) is equivalent to:",
        options: ["¬A ∨ ¬B", "¬A ∧ ¬B", "A ∨ B", "¬A ∨ B"],
        correctAnswer: "¬A ∨ ¬B",
        difficulty: 2,
        topic: "Boolean Algebra",
        // TEST A - Generic one-liner (deliberately vague)
        testAHint: "Think about how negation distributes over logical operators.",
        // TEST B - Three clearly different levels
        testBHints: {
            L1: "When you negate a conjunction, what happens to the connector and the individual terms?",
            L2: "De Morgan's rule: negating an **AND** flips it to **OR**, and each part gets negated too. So ¬(A ∧ B), the ∧ becomes ∨, and A becomes ¬A, B becomes ¬B. Put it together.",
            L3: "Let's use a real-life example! 'NOT (it's sunny AND warm)' means the same as 'it's NOT sunny OR it's NOT warm.' See what happened? The **AND** changed to **OR**, and each part got a **NOT** added. That's De Morgan's rule: ¬(A ∧ B) = **¬A ∨ ¬B**. Two things change: (1) the connector flips (AND to OR), (2) each term gets negated. You're doing brilliantly, look for this pattern in the options!"
        }
    },
    {
        id: 105,
        question: "In a directed graph, the sum of all vertex degrees is equal to:",
        options: ["2 × |E|", "|V|", "|E|", "2 × |V|"],
        correctAnswer: "2 × |E|",
        difficulty: 3,
        topic: "Graph Theory",
        // TEST A - Generic one-liner (deliberately vague)
        testAHint: "Consider how each edge relates to the vertices it connects.",
        // TEST B - Three clearly different levels
        testBHints: {
            L1: "How does each edge contribute to the total degree count when you consider both endpoints?",
            L2: "Every edge connects **two** vertices. It adds 1 to the degree of each endpoint, so each edge contributes exactly **2** to the total degree sum. If there are |E| edges total, what's the sum?",
            L3: "Think of edges as **handshakes** between people (vertices). Each handshake involves exactly **2 people**, so it gets counted twice, once for each person. If there are 3 handshakes, the total count = 3 × 2 = **6**. In general: **sum of all degrees = 2 × number of edges**. This works the same way in directed graphs. So the answer is **2 × |E|**. This is called the Handshaking Lemma, and now you know it!"
        }
    }
];