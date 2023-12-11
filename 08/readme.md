in typescript, please convert the following input:

RL

AAA = (BBB, CCC)
BBB = (DDD, EEE)
CCC = (ZZZ, GGG)
DDD = (DDD, DDD)
EEE = (EEE, EEE)
GGG = (GGG, GGG)
ZZZ = (ZZZ, ZZZ)

to the data structure:

{
moves: [Turn.R, Turn.L],
nodes: {
AAA: {
left: "BBB",
right: "CCC"
},
BBB: {
left: "DDD",
right: "EEE"
},
...
}
}
