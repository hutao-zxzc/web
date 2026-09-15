import random
num = random.randint(1,100)
num1 = 0
while num1 != num:
    # global(num1)
    num1 = int(input('请从1-100中随机选取一个数字：'))
    if num1 > num:
        print('太大了，再试试')
    elif num1 < num:
        print('太小了，再试试')
    else:
        break
print('太棒了，猜对了')
