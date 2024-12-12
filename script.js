// ===========================
// Seletores Principais
// ===========================
const cartModal = document.getElementById("cart-modal");
const cartItemsContainer = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const closeModalBtn = document.getElementById("close-modal-btn");
const menu = document.querySelector(".menu");
const cartBtn = document.getElementById("cart-btn");
const cartCount = document.getElementById("cart-count");
const addressInput = document.getElementById("address");
const checkoutBtn = document.getElementById("checkout-btn");
const customerNameInput = document.getElementById("customer-name");
const paymentInfo = document.getElementById("payment-info");
const pixInfo = document.getElementById("pix-info");
const copyPixBtn = document.getElementById("copy-pix-btn");
const pixKey = document.getElementById("pix-key");

// Array do carrinho unificado
let cart = [];

// ===========================
// Exibição do Modal do Carrinho
// ===========================
cartBtn.addEventListener("click", () => {
  cartModal.classList.add("active");
  cartModal.style.display = "flex";
});

closeModalBtn.addEventListener("click", () => {
  cartModal.classList.remove("active");
  cartModal.style.display = "none";
});

// ===========================
// Adicionar Item ao Carrinho (Pizzas)
    // ===========================
menu.addEventListener("click", (event) => {
  const parentButton = event.target.closest(".add-to-cart-btn");
  if (parentButton) {
    const name = parentButton.getAttribute("data-name");
    const price = parseFloat(parentButton.getAttribute("data-price"));
    const imageSrc = parentButton.querySelector("img")?.getAttribute("src") || "default-image.png";
    openCustomPopup(name, price, imageSrc);
  }
});

const orderNoteInput = document.getElementById("order-note");

// ===========================
// Função para Adicionar ao Carrinho com Personalização
// ===========================
function addToCart(item) {
  const existingItem = cart.find((cartItem) => cartItem.id === item.id);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push(item);
  }

  updateCartModal();
  updateCartCount();
}

// ===========================
// Atualização do Modal do Carrinho
// ===========================
function updateCartModal() {
  cartItemsContainer.innerHTML = "";
  let total = 0;

  cart.forEach((item, index) => {
    const cartItemElement = document.createElement("div");
    cartItemElement.classList.add("cart-item");
    cartItemElement.innerHTML = `
      <img src="${item.imageSrc}" alt="${item.name}" class="cart-item-image">
      <div class="cart-item-details">
        <p><strong>${item.name}</strong></p>
        <p><strong>Tamanho:</strong> ${item.size}</p>
        <p><strong>Sabores:</strong> ${item.flavors.join(", ")}</p>
        <p><strong>Massa:</strong> ${item.massa}</p>
        <p><strong>Borda:</strong> ${item.borda}</p>
        <p><strong>Refrigerante:</strong> ${item.refrigerante}</p>
        <p><strong>Observação:</strong> ${item.note || "Sem observação"}</p>
        <p><strong>Preço Unitário:</strong> R$ ${item.price.toFixed(2)}</p>
        <p><strong>Quantidade:</strong> ${item.quantity}</p>
        <p><strong>Subtotal:</strong> R$ ${(item.price * item.quantity).toFixed(2)}</p>
        <button class="remove-from-cart-btn" data-index="${index}">
          <i class="fas fa-trash-alt"></i> Remover
        </button>
      </div>
    `;
    cartItemsContainer.appendChild(cartItemElement);
    total += item.price * item.quantity;
  });

  cartTotal.textContent = `R$ ${total.toFixed(2)}`;
}

// ===========================
// Remover Item do Carrinho
// ===========================
cartItemsContainer.addEventListener("click", (event) => {
  if (event.target.closest(".remove-from-cart-btn")) {
    const index = parseInt(event.target.closest(".remove-from-cart-btn").getAttribute("data-index"));
    cart.splice(index, 1);
    updateCartModal();
    updateCartCount();
  }
});

// ===========================
// Finalizar Compra
// ===========================
document.getElementById("checkout-btn").addEventListener("click", () => {
  const customerName = document.getElementById("customer-name").value.trim();
  const address = document.getElementById("address").value.trim();
  const paymentMethod = document.querySelector('input[name="payment"]:checked').value;
  const cartItems = document.getElementById("cart-items").textContent.trim();
  const total = document.getElementById("cart-total").textContent.trim();

  if (!customerName || !address || !cartItems) {
      alert("Por favor, preencha todos os campos obrigatórios e adicione itens ao carrinho.");
      return;
  }

  const whatsappNumber = "75983178582"; // Substitua pelo número do WhatsApp com DDI e DDD.
  const message = `*Novo Pedido:*\n\n` +
                  `*Nome:* ${customerName}\n` +
                  `*Endereço:* ${address}\n` +
                  `*Forma de Pagamento:* ${paymentMethod}\n\n` +
                  `*Itens do Carrinho:* ${cartItems}\n` +
                  `*Total:* ${total}`;

  // Codifica a mensagem para ser usada na URL
  const encodedMessage = encodeURIComponent(message);

  // Redireciona para o WhatsApp
  window.location.href = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
});



// ===========================
// Atualizar Contador do Carrinho
// ===========================
function updateCartCount() {
  const totalCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  cartCount.textContent = totalCount;
}

// ===========================
// Forma de Pagamento - PIX
// ===========================
copyPixBtn.addEventListener("click", () => {
  navigator.clipboard.writeText(pixKey.textContent).then(() => {
    alert("Chave Pix copiada para a área de transferência!");
  }).catch(() => {
    alert("Falha ao copiar a chave Pix. Por favor, copie manualmente.");
  });
});

document.querySelectorAll('input[name="payment"]').forEach((radio) => {
  radio.addEventListener("change", handlePaymentMethodChange);
});

function handlePaymentMethodChange() {
  const selectedPayment = document.querySelector('input[name="payment"]:checked').value.toLowerCase();
  if (selectedPayment === "pix") {
    pixInfo.classList.remove("hidden");
  } else {
    pixInfo.classList.add("hidden");
  }
}

// ===========================
// Funções de Notificação
// ===========================
function notifyPendingCart() {
  if (cart.length > 0) {
    alert("Você tem itens no carrinho! Não esqueça de finalizar sua compra.");
  }
}

function startCartNotification() {
  setInterval(() => {
    if (cart.length > 0 && !document.body.classList.contains("checkout-in-progress")) {
      notifyPendingCart();
    }
  }, 60000);
}

checkoutBtn.addEventListener("click", () => {
  document.body.classList.add("checkout-in-progress");
  setTimeout(() => document.body.classList.remove("checkout-in-progress"), 300000);
});

// ===========================
// Inicializar ao Carregar Página
// ===========================
document.addEventListener("DOMContentLoaded", () => {
  startCartNotification();
});

















// ===========================
// CUSTOM POPUP
// ===========================
let selectedPizza = null; // Pizza selecionada
let basePrice = 0; // Preço base

// Elementos do popup
const popup = document.getElementById('customPopup');
const popupTitle = document.querySelector('.custom-popup-title');
const popupCloseBtn = document.getElementById('closePopup');
const popupAddBtn = document.getElementById('addToCartBtn');
const flavorCheckboxes = document.querySelectorAll('input[name="flavor"]');
const maxFlavorsDisplay = document.getElementById('maxFlavors');

// Tabela de preços base por tamanho
const sizePrices = {
  small: 20.0,
  medium: 30.0,
  large: 40.0,
  family: 60.0 // Adicionado para tamanho Família
};

// Atualizar o preço selecionado no popup
document.querySelectorAll('input[name="size"]').forEach(input => {
  input.addEventListener('change', () => {
    const selectedPrice = parseFloat(input.dataset.price).toFixed(2);
    document.getElementById('selectedPrice').textContent = `R$ ${selectedPrice.replace('.', ',')}`;
  });
});

// Funções de controle
function updateMaxFlavors() {
  const selectedSize = document.querySelector('input[name="size"]:checked');
  let maxFlavors = 2; // Valor padrão


  if (selectedSize) {
    if (selectedSize.value === 'medium') maxFlavors = 3; // Média com 3 sabores
    if (selectedSize.value === 'large') maxFlavors = 4;  // Grande com 4 sabores
    if (selectedSize.value === 'family') maxFlavors = 4; // Família com 4 sabores
  }
  

  const selectedFlavors = Array.from(flavorCheckboxes).filter(cb => cb.checked);

  maxFlavorsDisplay.textContent = maxFlavors;

  flavorCheckboxes.forEach(cb => {
    cb.disabled = !cb.checked && selectedFlavors.length >= maxFlavors;
  });
}

function toggleAddButton() {
  const sizeSelected = !!document.querySelector('input[name="size"]:checked');
  const flavorsSelected = Array.from(flavorCheckboxes).some(cb => cb.checked);
  popupAddBtn.disabled = !(sizeSelected && flavorsSelected);
}

// Função para abrir o popup de personalização
function openCustomPopup(name, price, imageSrc) {
  selectedPizza = name;
  basePrice = price;
  popupTitle.textContent = `Personalize sua ${name}`;
  popup.style.display = 'flex';

  // Resetar todas as opções
  flavorCheckboxes.forEach(cb => (cb.checked = false));
  document.querySelectorAll('input[name="size"]').forEach(input => (input.checked = false));
  document.querySelectorAll('input[name="massa"]').forEach(input => (input.checked = false));
  document.querySelectorAll('input[name="borda"]').forEach(input => (input.checked = false));
  document.querySelectorAll('input[name="refrigerante"]').forEach(input => (input.checked = false));
  document.getElementById("observacao").value = "";

  updateMaxFlavors();
  toggleAddButton();
}








// ===========================
// Adicionar Item ao Carrinho com Personalização de Hambúrguer
// ===========================
popupAddBtn.addEventListener("click", () => {
  const selectedPaoInput = document.querySelector('input[name="pao"]:checked');
  const selectedPao = selectedPaoInput ? selectedPaoInput.value : "Sem pão selecionado";
  const paoPrice = selectedPaoInput ? parseFloat(selectedPaoInput.dataset.extraPrice) : 0;

  const selectedCarneInput = document.querySelector('input[name="carne"]:checked');
  const selectedCarne = selectedCarneInput ? selectedCarneInput.value : "Sem carne selecionada";
  const carnePrice = selectedCarneInput ? parseFloat(selectedCarneInput.dataset.extraPrice) : 0;

  const selectedAdicionais = Array.from(document.querySelectorAll('input[name="adicionais"]:checked')).map(cb => ({
    name: cb.value,
    price: parseFloat(cb.dataset.extraPrice)
  }));

  const selectedMolhoInput = document.querySelector('input[name="molho"]:checked');
  const selectedMolho = selectedMolhoInput ? selectedMolhoInput.value : "Sem molho selecionado";
  const molhoPrice = selectedMolhoInput ? parseFloat(selectedMolhoInput.dataset.extraPrice) : 0;

  const observacao = document.getElementById("observacao").value.trim();

  // Calcular preço final
  const adicionaisPrice = selectedAdicionais.reduce((total, item) => total + item.price, 0);
  const finalPrice = basePrice + paoPrice + carnePrice + molhoPrice + adicionaisPrice;

  const itemId = Date.now();

  // Criar objeto do item
  const cartItem = {
    id: itemId,
    name: selectedPizza, // Substituir por "Hambúrguer" ou outra descrição genérica, se necessário
    pao: selectedPao,
    carne: selectedCarne,
    adicionais: selectedAdicionais.map(item => item.name),
    molho: selectedMolho,
    note: observacao,
    price: finalPrice,
    quantity: 1,
    imageSrc: "default-image.png"
  };

  addToCart(cartItem);
  popup.style.display = "none";
});

// ===========================
// Atualizar Modal do Carrinho com Informações de Hambúrguer
// ===========================
function updateCartModal() {
  cartItemsContainer.innerHTML = "";
  let total = 0;

  cart.forEach((item, index) => {
    const cartItemElement = document.createElement("div");
    cartItemElement.classList.add("cart-item");
    cartItemElement.innerHTML = `
      <img src="${item.imageSrc}" alt="${item.name}" class="cart-item-image">
      <div class="cart-item-details">
        <p><strong>${item.name}</strong></p>
        <p><strong>Pão:</strong> ${item.pao}</p>
        <p><strong>Carne:</strong> ${item.carne}</p>
        <p><strong>Adicionais:</strong> ${item.adicionais.length > 0 ? item.adicionais.join(", ") : "Nenhum"}</p>
        <p><strong>Molho:</strong> ${item.molho}</p>
        <p><strong>Observação:</strong> ${item.note || "Sem observação"}</p>
        <p><strong>Preço Unitário:</strong> R$ ${item.price.toFixed(2)}</p>
        <p><strong>Quantidade:</strong> ${item.quantity}</p>
        <p><strong>Subtotal:</strong> R$ ${(item.price * item.quantity).toFixed(2)}</p>
        <button class="remove-from-cart-btn" data-index="${index}">
          <i class="fas fa-trash-alt"></i> Remover
        </button>
      </div>
    `;
    cartItemsContainer.appendChild(cartItemElement);
    total += item.price * item.quantity;
  });

  cartTotal.textContent = `R$ ${total.toFixed(2)}`;
}



// Eventos para atualizar limites e botões
flavorCheckboxes.forEach(cb => cb.addEventListener('change', () => {
  updateMaxFlavors();
  toggleAddButton();
}));

document.querySelectorAll('input[name="size"]').forEach(input => input.addEventListener('change', () => {
  updateMaxFlavors();
  toggleAddButton();
}));

// Fechar popup ao clicar no botão de fechar
popupCloseBtn.addEventListener('click', function () {
  popup.classList.add('hidden');
  setTimeout(() => popup.style.display = 'none', 300);
});







  // Função para atualizar os preços
  function updateMenuPrices(sizePrice) {
    document.querySelectorAll('.menu-item').forEach((item) => {
      const basePrice = parseFloat(item.querySelector('.menu-price').dataset.basePrice);
      const newPrice = basePrice + sizePrice;
      item.querySelector('.menu-price').textContent = `R$ ${newPrice.toFixed(2).replace('.', ',')}`;
    });
  }

  // Event listener para os inputs de tamanho
  document.querySelectorAll('input[name="size"]').forEach((radio) => {
    radio.addEventListener('change', function () {
      const sizePrice = parseFloat(this.dataset.price);
      document.getElementById('selectedPrice').textContent = `R$ ${sizePrice.toFixed(2).replace('.', ',')}`;
      updateMenuPrices(sizePrice);
    });
  });




































  

// ===========================
// <!-- CARROSSEL -->
// ===========================

document.addEventListener("DOMContentLoaded", () => {
  const prevBtn = document.querySelector(".prev-btn");
  const nextBtn = document.querySelector(".next-btn");
  const carouselImages = document.querySelector(".carousel-images");
  const images = document.querySelectorAll(".carousel-image");
  const indicators = document.querySelectorAll(".carousel-indicator");

  let currentIndex = 0;

  const updateCarousel = () => {
      const offset = -currentIndex * 100; // Move para a próxima imagem (100% por imagem)
      carouselImages.style.transform = `translateX(${offset}%)`;
      updateIndicators();
  };

  const updateIndicators = () => {
      indicators.forEach((indicator, index) => {
          indicator.classList.toggle("active", index === currentIndex);
      });
  };

  prevBtn.addEventListener("click", () => {
      currentIndex = (currentIndex - 1 + images.length) % images.length; // Vai para a imagem anterior
      updateCarousel();
  });

  nextBtn.addEventListener("click", () => {
      currentIndex = (currentIndex + 1) % images.length; // Vai para a próxima imagem
      updateCarousel();
  });

  indicators.forEach((indicator, index) => {
      indicator.addEventListener("click", () => {
          currentIndex = index;
          updateCarousel();
      });
  });

  // Função para passar para a próxima imagem automaticamente
  const autoSlide = () => {
      currentIndex = (currentIndex + 1) % images.length; // Vai para a próxima imagem
      updateCarousel();
  };

  // Inicializa o carrossel
  updateCarousel();

  // Passa automaticamente a cada 5 segundos (5000 ms)
  setInterval(autoSlide, 5000);
});
