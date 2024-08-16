document.addEventListener('DOMContentLoaded', () => {
  const $form = document.getElementById('form');
  const $clearAll = document.getElementById('clear-form');
  const $inputAmount = document.getElementById('input-amount');
  const $inputTerm = document.getElementById('input-term');
  const $inputRate = document.getElementById('input-rate');
  const $radios = document.getElementById('input-radios');
  const $repayment = document.getElementById('repayment');
  const $interest = document.getElementById('interest');
  const $calculate = document.getElementById('calculate');
  const $resultValue = document.getElementById('result-value');
  const $resultEmpty = document.getElementById('result-empty');
  const $monthlyRepayment = document.getElementById('monthly-repayment');
  const $totalRepayment = document.getElementById('total-repayment');

  const clearErrors = () => {
    [$inputAmount, $inputTerm, $inputRate].forEach(input =>
      input.parentElement.classList.remove('input--error')
    );
    $radios.classList.remove('input--error');
  };

  const formatAmount = value => value.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });

  const handleInput = e => e.target.parentElement.classList.remove('input--error');

  // Limpiar valores del formulario
  $clearAll.addEventListener('click', () => {
    [$inputAmount, $inputTerm, $inputRate].forEach(input => input.value = '');
    $repayment.checked = false;
    $interest.checked = false;

    $resultValue.style.display = 'none';
    $resultEmpty.style.display = 'block';

    clearErrors();
  });

  // Formatear monto de la entrada
  $inputAmount.addEventListener('input', () => {
    clearErrors();
    let value = parseFloat($inputAmount.value.replace(/,/g, ""));

    $inputAmount.value = isNaN(value) || value <= 0 ? '' : value;
  });

  // Evento blur para formatear el valor
  $inputAmount.addEventListener('blur', () => {
    let value = parseFloat($inputAmount.value.replace(/,/g, ""));

    $inputAmount.value = isNaN(value) || value <= 0 ? '' : formatAmount(value);
  });

  // Evento focus para eliminar el formateo al entrar al campo de entrada
  $inputAmount.addEventListener('focus', () => {
    let value = parseFloat($inputAmount.value.replace(/,/g, ""));

    $inputAmount.value = isNaN(value) || value <= 0 ? '' : value;
  });

  [$inputTerm, $inputRate].forEach(input =>
    input.addEventListener('input', handleInput)
  );

  // Añadir clase "input--error" si no se llenan los campos correspondientes
  $calculate.addEventListener('click', () => {
    // Remover clase de error
    clearErrors();

    if ($inputAmount.value === '') {
      $inputAmount.parentElement.classList.add('input--error');
    }
    if ($inputTerm.value === '') {
      $inputTerm.parentElement.classList.add('input--error');
    }
    if ($inputRate.value === '') {
      $inputRate.parentElement.classList.add('input--error');
    }
    if ($radios.querySelector('input:checked') === null) {
      $radios.classList.add('input--error');
    } else {
      // Llamar a la función de cálculo
      calculateInterest();
    }
  });

  // Calcular el interés en función del monto, el interés y el periodo de tiempo (años)
  const calculateInterest = () => {
    let amount = parseFloat($inputAmount.value.replace(/,/g, "")) || 0;
    let term = parseInt($inputTerm.value) || 0;
    let rate = parseFloat($inputRate.value) / 100 || 0;
    let mortgageType = $repayment.checked ? 'repayment' : 'interest';

    let monthlyPayment = 0;
    let totalRepayment = 0;

    if (mortgageType === 'repayment') {
      const monthlyRate = rate / 12;
      const n = term * 12;
      monthlyPayment = (amount * monthlyRate) / (1 - Math.pow((1 + monthlyRate), -n));
      totalRepayment = monthlyPayment * n;
    } else if (mortgageType === 'interest') {
      monthlyPayment = (amount * rate) / 12;
      totalRepayment = monthlyPayment * term * 12;
    }

    // Mostrar resultados
    $monthlyRepayment.innerHTML = `$ ${formatAmount(monthlyPayment)}`;
    $totalRepayment.innerHTML = `$ ${formatAmount(totalRepayment)}`;

    $resultValue.style.display = 'block';
    $resultEmpty.style.display = 'none';
  };
});
