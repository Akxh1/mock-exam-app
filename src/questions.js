export const questionBank = [
    {
        id: 101,
        question: "If A = {1, 2} and B = {2, 3}, what is A ∩ B?",
        options: ["{1, 2, 3}", "{2}", "{1, 3}", "{}"],
        correctAnswer: "{2}",
        difficulty: 1, // 1=Easy
        topic: "Sets"
    },
    {
        id: 102,
        question: "What is the binary representation of decimal 10?",
        options: ["1010", "1001", "1100", "0101"],
        correctAnswer: "1010",
        difficulty: 1,
        topic: "Binary"
    },
    {
        id: 103,
        question: "Which of the following is a tautology?",
        options: ["p ∧ q", "p ∨ ¬p", "p → q", "¬(p ∨ q)"],
        correctAnswer: "p ∨ ¬p",
        difficulty: 2, // 2=Medium
        topic: "Logic"
    },
    {
        id: 104,
        question: "Calculate the determinant of a 2x2 identity matrix.",
        options: ["0", "1", "2", "Undefined"],
        correctAnswer: "1",
        difficulty: 2,
        topic: "Matrices"
    },
    {
        id: 105,
        question: "In a directed graph, the sum of degrees is equal to?",
        options: ["2 * |E|", "|V|", "|E|", "2 * |V|"],
        correctAnswer: "2 * |E|",
        difficulty: 3, // 3=Hard
        topic: "Graph Theory"
    },
    {
        id: 106,
        question: "A function f: A -> B is injective if:",
        options: ["f(x) = f(y) implies x = y", "For all y in B, there exists x in A", "f(x) = y", "A = B"],
        correctAnswer: "f(x) = f(y) implies x = y",
        difficulty: 2,
        topic: "Functions"
    },
    {
        id: 107,
        question: "How many ways can 5 books be arranged on a shelf?",
        options: ["120", "20", "25", "60"],
        correctAnswer: "120",
        difficulty: 1,
        topic: "Combinatorics"
    },
    {
        id: 108,
        question: "Probability of getting heads in a fair coin toss?",
        options: ["0.5", "1", "0", "0.25"],
        correctAnswer: "0.5",
        difficulty: 1,
        topic: "Probability"
    },
    {
        id: 109,
        question: "De Morgan's First Law states ¬(A ∧ B) is equivalent to:",
        options: ["¬A ∨ ¬B", "¬A ∧ ¬B", "A ∨ B", "¬A ∨ B"],
        correctAnswer: "¬A ∨ ¬B",
        difficulty: 2,
        topic: "Boolean Algebra"
    },
    {
        id: 110,
        question: "What is the GCD of 8 and 12?",
        options: ["4", "2", "8", "24"],
        correctAnswer: "4",
        difficulty: 1,
        topic: "Number Theory"
    },
    {
        id: 111,
        question: "If set A has 3 elements, how many elements are in its Power Set?",
        options: ["8", "6", "9", "3"],
        correctAnswer: "8",
        difficulty: 2,
        topic: "Sets"
    },
    {
        id: 112,
        question: "The contrapositive of p → q is:",
        options: ["¬q → ¬p", "q → p", "¬p → ¬q", "¬p ∨ q"],
        correctAnswer: "¬q → ¬p",
        difficulty: 2,
        topic: "Logic"
    },
    {
        id: 113,
        question: "A tree with n vertices has how many edges?",
        options: ["n - 1", "n", "n + 1", "2n"],
        correctAnswer: "n - 1",
        difficulty: 2,
        topic: "Graph Theory"
    },
    {
        id: 114,
        question: "If Matrix A is 2x3 and B is 3x2, the product AB is:",
        options: ["2x2", "3x3", "2x3", "Undefined"],
        correctAnswer: "2x2",
        difficulty: 2,
        topic: "Matrices"
    },
    {
        id: 115,
        question: "A relation R is transitive if (a,b)∈R and (b,c)∈R implies:",
        options: ["(a,c)∈R", "(c,a)∈R", "(b,a)∈R", "(c,b)∈R"],
        correctAnswer: "(a,c)∈R",
        difficulty: 2,
        topic: "Relations"
    },
    {
        id: 116,
        question: "Union of sets {1, 2} and {2, 3} is:",
        options: ["{1, 2, 3}", "{2}", "{1, 2, 2, 3}", "{}"],
        correctAnswer: "{1, 2, 3}",
        difficulty: 1,
        topic: "Sets"
    },
    {
        id: 117,
        question: "Hexadecimal digit 'F' represents decimal:",
        options: ["15", "16", "14", "12"],
        correctAnswer: "15",
        difficulty: 1,
        topic: "Binary"
    },
    {
        id: 118,
        question: "The symbol ↔ represents:",
        options: ["Biconditional", "Implication", "Conjunction", "Disjunction"],
        correctAnswer: "Biconditional",
        difficulty: 1,
        topic: "Logic"
    },
    {
        id: 119,
        question: "Formula for Combinations C(n, k) is:",
        options: ["n! / (k!(n-k)!)", "n! / (n-k)!", "n! * k!", "n! / k!"],
        correctAnswer: "n! / (k!(n-k)!)",
        difficulty: 2,
        topic: "Combinatorics"
    },
    {
        id: 120,
        question: "Probability of rolling a 7 with a standard 6-sided die?",
        options: ["0", "1/6", "1", "1/7"],
        correctAnswer: "0",
        difficulty: 1,
        topic: "Probability"
    },
    {
        id: 121,
        question: "A graph has an Euler Path if it has:",
        options: ["0 or 2 odd degree vertices", "All even degree vertices", "No odd degree vertices", "Connected vertices"],
        correctAnswer: "0 or 2 odd degree vertices",
        difficulty: 3,
        topic: "Graph Theory"
    },
    {
        id: 122,
        question: "Max nodes in a binary tree of height h (root at 0)?",
        options: ["2^(h+1) - 1", "2^h", "2^h - 1", "2^(h-1)"],
        correctAnswer: "2^(h+1) - 1",
        difficulty: 2,
        topic: "Trees"
    },
    {
        id: 123,
        question: "A matrix has an inverse if its determinant is:",
        options: ["Non-zero", "Zero", "Positive", "Negative"],
        correctAnswer: "Non-zero",
        difficulty: 2,
        topic: "Matrices"
    },
    {
        id: 124,
        question: "Relation R on set A is reflexive if:",
        options: ["For all a in A, (a,a) in R", "For all a,b, (a,b) in R -> (b,a) in R", "For no a, (a,a) in R", "R is empty"],
        correctAnswer: "For all a in A, (a,a) in R",
        difficulty: 2,
        topic: "Relations"
    },
    {
        id: 125,
        question: "Which pattern represents a tautology?",
        options: ["All True in truth table", "All False", "Mixed True/False", "None"],
        correctAnswer: "All True in truth table",
        difficulty: 1,
        topic: "Logic"
    },
    {
        id: 126,
        question: "Boolean expression A + 1 equals:",
        options: ["1", "A", "0", "A'"],
        correctAnswer: "1",
        difficulty: 1,
        topic: "Boolean Algebra"
    },
    {
        id: 127,
        question: "Set A is a subset of B if:",
        options: ["Every element of A is in B", "A = B", "Some elements of A are in B", "B is empty"],
        correctAnswer: "Every element of A is in B",
        difficulty: 1,
        topic: "Sets"
    },
    {
        id: 128,
        question: "Which symbol denotes 'For All'?",
        options: ["∀", "∃", "∈", "⊂"],
        correctAnswer: "∀",
        difficulty: 1,
        topic: "Logic"
    },
    {
        id: 129,
        question: "The set of all actual outputs of a function is its:",
        options: ["Range", "Domain", "Codomain", "Inverse"],
        correctAnswer: "Range",
        difficulty: 1,
        topic: "Functions"
    },
    {
        id: 130,
        question: "Number of permutations of 'ABC'?",
        options: ["6", "3", "9", "27"],
        correctAnswer: "6",
        difficulty: 1,
        topic: "Combinatorics"
    },
    {
        id: 131,
        question: "If P(A) = 0.5, P(B) = 0.5, and independent, P(A and B) = ?",
        options: ["0.25", "0.5", "1", "0"],
        correctAnswer: "0.25",
        difficulty: 2,
        topic: "Probability"
    },
    {
        id: 132,
        question: "Number of edges in Complete Graph K4?",
        options: ["6", "4", "12", "16"],
        correctAnswer: "6",
        difficulty: 2,
        topic: "Graph Theory"
    },
    {
        id: 133,
        question: "A leaf node in a tree has degree:",
        options: ["1 (if connected)", "0", "2", "3"],
        correctAnswer: "1 (if connected)",
        difficulty: 1,
        topic: "Trees"
    },
    {
        id: 134,
        question: "Transpose of Row Matrix is:",
        options: ["Column Matrix", "Square Matrix", "Identity Matrix", "Zero Matrix"],
        correctAnswer: "Column Matrix",
        difficulty: 1,
        topic: "Matrices"
    },
    {
        id: 135,
        question: "Equivalence relations are Reflexive, Symmetric, and:",
        options: ["Transitive", "Antisymmetric", "Injective", "Connected"],
        correctAnswer: "Transitive",
        difficulty: 2,
        topic: "Relations"
    },
    {
        id: 136,
        question: "Smallest prime number?",
        options: ["2", "1", "3", "0"],
        correctAnswer: "2",
        difficulty: 1,
        topic: "Number Theory"
    },
    {
        id: 137,
        question: "Set difference A - B contains:",
        options: ["Elements in A not in B", "Elements in B not in A", "Elements in both", "Elements in neither"],
        correctAnswer: "Elements in A not in B",
        difficulty: 1,
        topic: "Sets"
    },
    {
        id: 138,
        question: "17 mod 5 is:",
        options: ["2", "3", "1", "0"],
        correctAnswer: "2",
        difficulty: 1,
        topic: "Number Theory"
    },
    {
        id: 139,
        question: "XOR of 1 and 1 is:",
        options: ["0", "1", "2", "11"],
        correctAnswer: "0",
        difficulty: 1,
        topic: "Binary"
    },
    {
        id: 140,
        question: "Chromatic number of a K3 graph?",
        options: ["3", "2", "1", "4"],
        correctAnswer: "3",
        difficulty: 2,
        topic: "Graph Theory"
    }
];

export const getRandomQuestions = (count) => {
    const shuffled = [...questionBank].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
};