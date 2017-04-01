def multiples_summation(a):
	result = 0
	for x in range(0, a):
		if (x % 3 == 0 and x % 5 == 0):
			result += x
		elif (x % 3 == 0):
			result += x
		elif (x % 5 == 0):
			result += x
		else:
			result = result
	return result
	
print multiples_summation(1000)