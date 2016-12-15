import json

output = []


def createQuarter(listInput, qtr, yr):
    
    in0 = listInput[0]
    in1 = listInput[1]
    in2 = listInput[2]
    
    quarter = dict()
    
    for key in in0:
        if type(in0[key]) is int and type(in1[key]) is int and type(in2[key]) is int:
            quarter[key] = (in0[key] + in1[key] + in2[key]) // 3
        else:
            quarter[key] = in0[key]
    
    quarter['key'] = str(yr) + '!' + str(qtr)
    
    output.append(quarter)
    
with open('pythonPlay.json') as json_data:
    d = json.load(json_data)
    
    temp = []

    for i in range(0, len(d)):        
        obj = d[i]
        key = obj['key']
        
        temp.append(d[i])
        month = key.split('-')[0]
        year = key.split('-')[1]
        
        if(key.split("-")[0] == '3'):
            createQuarter(temp, 1, year)
            temp = []
        elif(key.split("-")[0] == '6'):
            createQuarter(temp, 2, year)
            temp = []
        elif(key.split("-")[0] == '9'):
            createQuarter(temp, 3, year)
            temp = []
        elif(key.split("-")[0] == '12'):
            createQuarter(temp, 4, year)
            temp = []
        
with open('data.txt', 'w') as outfile:
    json.dump(output, outfile)

