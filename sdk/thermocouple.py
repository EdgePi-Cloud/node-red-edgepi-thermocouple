import spidev
from gpiozero import LED
from .MAX31856 import *
from time import sleep
import logging

_logger=logging.getLogger(__name__)

def dump_regs(spi, cs):
    _logger.info(f'Dumping register values')
    data = spi_transfer(spi, cs, CR0_R, [0xFF]*16)
    _logger.info(f'{data}')

def single_conversion(spi, cs):
    _logger.info(f'Single Conversion Triggered')
    cr0 = spi_transfer(spi,cs, CR0_R, [0xFF])
    spi_transfer(spi, cs, CR0_W, [cr0[1]+ONE_SHOT_MODE])
    sleep(1)
    cold_junction_regs = spi_transfer(spi, cs, CJTO_R, [0xFF]*3)
    linearized_TC_regs = spi_transfer(spi, cs, LTCBH_R, [0xFF]*3)

    cold_junction_code = ((cold_junction_regs[2]<<8) + cold_junction_regs[3]) >> 2
    if cold_junction_regs[2] & 0x80:
        cold_junction_code -= 2**(COLD_JUNCTION_BITS - 1)

    linearized_TC_code = ((linearized_TC_regs[1]<<16) + (linearized_TC_regs[2]<< 8) + linearized_TC_regs[3])>>5
    if linearized_TC_regs[1] & 0x80:
        linearized_TC_code -= 2**(LINEARIZED_TC_BITS - 1)

    _logger.info(f'Cold Junction Regs: {cold_junction_regs}')
    _logger.info(f'Linearized TC Regs: {linearized_TC_regs}')

    _logger.info(f'Cold Junction Code--Raw: {cold_junction_code}')
    _logger.info(f'Linearized TC Code--Raw: {linearized_TC_code}')

    _logger.info(f'Cold Junction Code: {cold_junction_code * (2**-6)}')
    _logger.info(f'Linearized TC Code: {linearized_TC_code * (2**-7)}')

    return linearized_TC_code * (2**-7)

def disable_CJ(spi, cs):
    _logger.info(f'Disabling Cold Junction Sensor')
    spi_transfer(spi, cs, CR0_W, [0x08])

def enable_CJ(spi, cs):
    _logger.info(f'Enabling Cold Junction Sensor')
    spi_transfer(spi, cs, CR0_W, [0x00])

def CJ_override(spi, cs):
    _logger.info(f'Over ride CJ with manual CJ measurement')
    temp = int(input('Enter temperature: ').strip())
    temp = int ((temp / (2**-6))) << 2
    CJTH = temp >> 8
    CJTL = temp & 0xFF
    _logger.info(f'CJTH: {CJTH}, CJTL: {CJTL}')
    spi_transfer(spi,cs,CJTH_W,[CJTH, CJTL])

def measure_and_save(spi, cs):
    file_name = input("""Enter the name of file: """).strip()
    dir = 'measurements/'
    file_name = dir + file_name
    f = open(file_name, 'a')
    f.write(f'CJT, LTC  \n')
    for i in range(100):
        CJT, LTC = single_conversion(spi,cs)
        f.write(f'{CJT}, {LTC}\n')
    f.close()

def write_register(spi, cs):
    address = int(input("""Enter target address: """).strip())
    value = int(input("""Enter value to write: """).strip())
    spi_transfer(spi, cs, address, [value])
    _logger.info(f'Value Written')

def spi_transfer(spi, cs, start_add, value):
    data = [start_add] + value
    _logger.debug(f'{data}')
    cs.off()
    spi.xfer(data)
    cs.on()
    _logger.debug(f'{data}')
    return data

def init_spi_dev():
    spi = spidev.SpiDev()
    spi.open(6, 0)
    spi.max_speed_hz = 1000000
    spi.mode = 1
    cs_line_4 = LED(16)
    cs_line_4.on()
    return {'spi':spi, 'cs':cs_line_4}
    