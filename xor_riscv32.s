.text
.globl main

# Programa: XOR lógico (1=falso, 2=verdadeiro)
# Formato de entrada (stdin):
#   N
#   X Y   (N linhas; X,Y em {1,2})
# Saída: N linhas com 1 (falso) ou 2 (verdadeiro) para X XOR Y
# Ambiente: RARS (RISC-V), syscalls via a7 + ecall

main:
    # Ler N
    li a7, 5          # syscall: read int
    ecall
    mv s0, a0         # s0 = N

    li s1, 0          # contador i = 0

loop_begin:
    bge s1, s0, end_program   # if i >= N -> fim

    # Ler X
    li a7, 5          # read int
    ecall
    mv t0, a0         # t0 = X

    # Ler Y
    li a7, 5          # read int
    ecall
    mv t1, a0         # t1 = Y

    # XOR lógico (1=falso, 2=verdadeiro):
    # Resultado é 1 se X == Y, caso contrário 2
    beq t0, t1, result_false
    li a0, 2          # true
    j print_result

result_false:
    li a0, 1          # false

print_result:
    # imprimir inteiro do resultado
    li a7, 1          # print int
    ecall

    # imprimir '\n'
    li a0, 10         # '\n'
    li a7, 11         # print char
    ecall

    addi s1, s1, 1    # i++
    j loop_begin

end_program:
    li a7, 10         # exit
    ecall
