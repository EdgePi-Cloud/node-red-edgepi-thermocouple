# Read addresses
CR0_R = 0x00
CR1_R = 0x01
MASK_R = 0x02
CJHF_R = 0x03
CJLF_R = 0x04
LTHFTH_R = 0x05
LTHFTL_R = 0x06
LTLFTH_R = 0x07
LTLFTL_R = 0x08
CJTO_R = 0x09
CJTH_R = 0x0A
CJTL_R = 0x0B
LTCBH_R = 0x0C
LTCBM_R = 0x0D
LTCBL_R = 0x0E
SR_R = 0x0F

#Write addresses
CR0_W = 0x80
CR1_W = 0x81
MASK_W = 0x82
CJHF_W = 0x83
CJLF_W = 0x84
LTHFTH_W = 0x85
LTHFTL_W = 0x86
LTLFTH_W = 0x87
LTLFTL_W = 0x88
CJTO_W = 0x89
CJTH_W = 0x8A
CJTL_W = 0x8B

# Thermocouple Types
B_TYPE = 0x0  #B Type Thermocouple
E_TYPE = 0x1  #E Type Thermocouple
J_TYPE = 0x2  #J Type Thermocouple
K_TYPE = 0x3  #K Type Thermocouple
N_TYPE = 0x4  #N Type Thermocouple
R_TYPE = 0x5  #R Type Thermocouple
S_TYPE = 0x6  #S Type Thermocouple
T_TYPE = 0x7  #T Type Thermocouple

ONE_SHOT_MODE = 0x40
CONTINUOUS_MODE = 0x80

COLD_JUNCTION_BITS = 14
LINEARIZED_TC_BITS = 19